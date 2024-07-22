package com.journalistjunction.controller;

import com.journalistjunction.model.Comment;
import com.journalistjunction.service.CommentService;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@AllArgsConstructor
@RequestMapping(value = "/comment")
public class CommentController {

    private final CommentService commentService;

    @GetMapping("/article/{id}")
    public List<Comment> getAllCommentsByArticle(@PathVariable Long id) {
        return commentService.getAllCommentsByArticle(id);
    }

    @GetMapping("/is-liked/{id}")
    public boolean isCommLikedByUser(@PathVariable Long id) {
        return commentService.isCommLiked(id);
    }

    @PostMapping("/new-comm")
    public Comment postNewComment(@RequestBody Comment comment) {
        return commentService.addNewComment(comment);
    }

    @PostMapping("/child-comm/{parentCommId}")
    public Comment postChildComment(@RequestBody Comment comment, @PathVariable Long parentCommId) {
        return commentService.addChildComment(comment, parentCommId);
    }

    @PutMapping("/edit/{id}")
    public void editComment(@RequestBody Comment comment, @PathVariable Long id) {
        commentService.editComment(comment, id);
    }

    @PutMapping("/action/{id}")
    public void likeOrUnLikeComm(@PathVariable Long id) {
        commentService.likeOrUnlikeComment(id);
    }

    @DeleteMapping("/{id}")
    public void deleteComment(@PathVariable("id") Long id) {
        commentService.deleteCommentById(id);
    }
}
