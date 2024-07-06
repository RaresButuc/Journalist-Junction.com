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

@Service
@AllArgsConstructor
public class CommentService {
    private final CommentRepository commentRepository;


    public List<Comment> getAllCommentsByArticle(Long articleId) {
        return commentRepository.getAllByArticleIdAndParentIsNullOrderByLikesDesc(articleId);
    }

    public void addNewComment(Comment comment) {
        Comment preparedComm = prepareCommentToPost(comment);

        commentRepository.save(preparedComm);
    }

    public void addChildComment(Comment comment, Long parentCommId) {
        Comment preparedComment = prepareCommentToPost(comment);
        Comment parentComm = commentRepository.findById(parentCommId).orElseThrow(() -> new NoSuchElementException("The Comment You Are Trying To Respond To Doesn't Exist!"));

        if (parentComm.getParent() == null) {
            parentComm.setParent(parentComm);
        } else {
            parentComm.setParent(parentComm.getParent());
        }

        commentRepository.save(preparedComment);
    }

    public void editComment(Comment newComment, Long commentId) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = (User) auth.getPrincipal();

        Comment comm = commentRepository.findById(commentId).orElseThrow(() -> new NoSuchElementException("The Comment You Are Trying To Edit To Doesn't Exist!"));

        if (comm.getUser().getId().equals(user.getId())) {
            comm.setEdited(true);
            comm.setContent(newComment.getContent());
        } else {
            throw new IllegalStateException("You Can't Edit This Comment!");
        }
    }

    public Comment prepareCommentToPost(Comment comment) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = (User) auth.getPrincipal();

        if (user == null) {
            throw new IllegalStateException("You Should Be Logged To Post Comments!");
        }

        comment.setLikes(0L);
        comment.setUser(user);
        comment.setEdited(false);
        comment.setPostTime(LocalDateTime.now());

        return comment;
    }

    public void deleteCommentById(Long id) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = (User) auth.getPrincipal();

        if (Objects.equals(commentRepository.findById(id).orElseThrow(() -> new NoSuchElementException("The Comment You Are Trying To Delete Doesn't Exists!")).getUser().getId(), user.getId())) {
            commentRepository.deleteById(id);
        } else {
            throw new IllegalStateException("You Can't Delete This Comment!");
        }
    }
}
