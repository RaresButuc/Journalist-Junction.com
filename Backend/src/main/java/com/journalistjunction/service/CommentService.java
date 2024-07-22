package com.journalistjunction.service;

import com.journalistjunction.model.Comment;
import com.journalistjunction.model.ParentCommData;
import com.journalistjunction.model.User;
import com.journalistjunction.repository.CommentRepository;
import lombok.AllArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class CommentService {

    private final ArticleService articleService;

    private final CommentRepository commentRepository;

    public List<Comment> getAllCommentsByArticle(Long articleId) {
        return commentRepository.getAllByArticleIdAndParentIsNullOrderByLikesDesc(articleId);
    }

    public Comment addNewComment(Comment comment) {
        if (!articleService.getArticleIsPublished(comment.getArticle().getId())) {
            throw new IllegalStateException("You Can't Comments on UnPublished Articles! Try Again Later!");
        }

        Comment preparedComm = prepareCommentToPost(comment);

        return commentRepository.save(preparedComm);
    }

    public Comment addChildComment(Comment comment, Long parentCommId) {
        if (!articleService.getArticleIsPublished(comment.getArticle().getId())) {
            throw new IllegalStateException("You Can't Comments on UnPublished Articles! Try Again Later!");
        }

        Comment preparedComment = prepareCommentToPost(comment);
        Comment parentComm = commentRepository.findById(parentCommId).orElseThrow(() -> new NoSuchElementException("The Comment You Are Trying To Respond To Doesn't Exist!"));
        Comment mainComm = findMainByChildId(parentComm.getArticle().getId(), parentComm.getId());

        preparedComment.setParent(parentComm);
        preparedComment.setParentCommData(new ParentCommData(parentCommId, parentComm.getUser().getName()));

        if (mainComm == null) {
            preparedComment.setMainComment(parentComm);
        } else {
            preparedComment.setMainComment(mainComm);
        }

        commentRepository.save(parentComm);

        return commentRepository.save(preparedComment);
    }

    public void editComment(Comment newComment, Long commentId) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = (User) auth.getPrincipal();

        Comment comm = commentRepository.findById(commentId).orElseThrow(() -> new NoSuchElementException("The Comment You Are Trying To Edit To Doesn't Exist!"));

        if (!comm.getArticle().isPublished()) {
            throw new IllegalStateException("You Can't Comments on UnPublished Articles! Try Again Later!");
        }

        if (newComment.getContent().isEmpty() || newComment.getContent().isBlank()) {
            throw new IllegalStateException("You Can't Post Empty Comments! Try Again!");
        }

        if (comm.getUser().getId().equals(user.getId())) {
            if (!comm.isEdited() && comm.getContent().equals(newComment.getContent())) {
                comm.setEdited(true);
            }
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
        comment.setPostTime(postTime);
        comment.setStringPostTime(hourAndSeconds + " / " + dayAndMonth);

        return comment;
    }

    public void likeOrUnlikeComment(Long id) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = (User) auth.getPrincipal();

        Comment comment = commentRepository.findById(id).orElseThrow(() -> new NoSuchElementException("No Comment Was Found!"));
        boolean isLiked = isCommLiked(id);

        if (!comment.getArticle().isPublished()) {
            throw new IllegalStateException("You Can't Comments on UnPublished Articles! Try Again Later!");
        }

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

    public Comment findParentByChildId(Long articleId, Long childId) {
        List<Comment> articleComments = getAllCommentsByArticle(articleId);
        Comment commParent = null;

        for (Comment comment : articleComments) {
            List<Comment> parentChildren = comment.getParentChildren();
            boolean isMainTheParent = parentChildren.stream()
                    .anyMatch(e -> Objects.equals(e.getId(), childId));
            if (isMainTheParent) {
                commParent = comment;
            } else {
                for (Comment mainChildrenComm : comment.getParentChildren()) {
                    List<Comment> children = mainChildrenComm.getParentChildren();
                    boolean isThisTheParent = children.stream().
                            anyMatch(e -> Objects.equals(e.getId(), childId));

                    commParent = isThisTheParent ? mainChildrenComm : null;
                }
            }
        }
        return commParent;
    }

    public Comment findMainByChildId(Long articleId, Long childId) {
        List<Comment> articleComments = getAllCommentsByArticle(articleId);
        Comment commMain = null;

        for (Comment comment : articleComments) {
            List<Comment> mainChildren = comment.getMainChildren();
            boolean isThisMain = mainChildren.stream()
                    .anyMatch(e -> Objects.equals(e.getId(), childId));
            if (isThisMain) {
                commMain = comment;
            } else {
                for (Comment mainChildrenComm : comment.getMainChildren()) {
                    List<Comment> children = mainChildrenComm.getMainChildren();
                    boolean isThisTheMain = children.stream().
                            anyMatch(e -> Objects.equals(e.getId(), childId));

                    commMain = isThisTheMain ? mainChildrenComm : null;
                }
            }
        }
        return commMain;
    }

    public void deleteCommentById(Long id) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = (User) auth.getPrincipal();

        Comment comm = commentRepository.findById(id).orElseThrow(() -> new NoSuchElementException("The Comment You Are Trying To Delete Doesn't Exists!"));
        Comment parentComm = findParentByChildId(comm.getArticle().getId(), comm.getId());

        if (!comm.getArticle().isPublished()) {
            throw new IllegalStateException("You Can't Comments on UnPublished Articles! Try Again Later!");
        }

        if (Objects.equals(comm.getUser().getId(), user.getId()) ||
                Objects.equals(comm.getArticle().getOwner().getId(), user.getId())) {
            if (parentComm != null) {

                commentRepository.save(parentComm);
            }

            commentRepository.deleteById(id);
        } else {
            throw new IllegalStateException("You Can't Delete This Comment!");
        }
    }
}
