package com.journalistjunction.service;

import com.journalistjunction.model.Comment;
import com.journalistjunction.model.User;
import com.journalistjunction.repository.CommentRepository;
import lombok.AllArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.Objects;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class CommentService {
    private final CommentRepository commentRepository;
    private final UserService userService;


    public Comment getCommentById(Long id) {
        return commentRepository.findById(id).orElseThrow(() -> new NoSuchElementException("An Error Has Occurred!"));
    }

    public List<Comment> getAllCommentsByArticle(Long articleId) {
        return commentRepository.getAllByArticleIdAndParentIsNullOrderByLikesDesc(articleId);
    }

    public Comment addNewComment(Comment comment) {
        Comment preparedComm = prepareCommentToPost(comment);

        return commentRepository.save(preparedComm);
    }

    public void addChildComment(Comment comment, Long parentCommId) {
        Comment preparedComment = prepareCommentToPost(comment);
        Comment parentComm = commentRepository.findById(parentCommId).orElseThrow(() -> new NoSuchElementException("The Comment You Are Trying To Respond To Doesn't Exist!"));

        if (parentComm.getParent() == null) {
            preparedComment.setParent(parentComm);
        } else {
            preparedComment.setParent(parentComm.getParent());
        }

        parentComm.setRepliesCount(parentComm.getRepliesCount() + 1);
        commentRepository.save(preparedComment);
    }

    public void editComment(Comment newComment, Long commentId) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = (User) auth.getPrincipal();

        Comment comm = commentRepository.findById(commentId).orElseThrow(() -> new NoSuchElementException("The Comment You Are Trying To Edit To Doesn't Exist!"));

        if (newComment.getContent().isEmpty() || newComment.getContent().isBlank()) {
            throw new IllegalStateException("You Can't Post Empty Comments! Try Again!");
        }

        if (comm.getUser().getId().equals(user.getId())) {
            comm.setEdited(true);
            comm.setContent(newComment.getContent());

            commentRepository.save(comm);
        } else {
            throw new IllegalStateException("You Can't Edit This Comment!");
        }
    }

    public Comment prepareCommentToPost(Comment comment) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = (User) auth.getPrincipal();

        if (user == null) {
            throw new IllegalStateException("You Should Be Logged To Post Comments!");
        } else if (comment.getContent().isEmpty() || comment.getContent().isBlank()) {
            throw new IllegalStateException("You Can't Post Empty Comments! Try Again!");
        }

        LocalDateTime postTime = LocalDateTime.now();

        String hourAndSeconds = postTime.getHour() + ":" + postTime.getSecond();
        String dayAndMonth = postTime.getDayOfWeek().name() + ", " + postTime.getDayOfMonth() + " " + postTime.getMonth() + " " + postTime.getYear();

        comment.setLikes(0L);
        comment.setUser(user);
        comment.setEdited(false);
        comment.setRepliesCount(0L);
        comment.setStringPostTime(hourAndSeconds + " / " + dayAndMonth);

        return comment;
    }

    public void likeOrUnlikeComment(Long id) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = (User) auth.getPrincipal();

        Comment comment = commentRepository.findById(id).orElseThrow(() -> new NoSuchElementException("No Comment Was Found!"));
        boolean isLiked = isCommLiked(id);

        if (isLiked) {
            comment.setLikes(comment.getLikes() - 1);
            List<User> usersFiltered = comment.getLikers().stream().filter(e -> !Objects.equals(e.getId(), user.getId())).collect(Collectors.toList());

            comment.setLikers(usersFiltered);
        } else {
            List<User> newLikers = comment.getLikers();
            newLikers.add(user);

            comment.setLikes(comment.getLikes() + 1);
            comment.setLikers(newLikers);
        }

        commentRepository.save(comment);
    }

    public boolean isCommLiked(Long id) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = (User) auth.getPrincipal();

        return commentRepository.findById(id).orElseThrow(() -> new NoSuchElementException("No Comment Was Found!")).getLikers().stream().anyMatch(e -> e.getId().equals(user.getId()));
    }

    public void deleteCommentById(Long id) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = (User) auth.getPrincipal();

        Comment comm = commentRepository.findById(id).orElseThrow(() -> new NoSuchElementException("The Comment You Are Trying To Delete Doesn't Exists!"));
        if (Objects.equals(comm.getUser().getId(), user.getId()) ||
                Objects.equals(comm.getArticle().getOwner().getId(), user.getId())) {
            commentRepository.deleteById(id);
        } else {
            throw new IllegalStateException("You Can't Delete This Comment!");
        }
    }
}
