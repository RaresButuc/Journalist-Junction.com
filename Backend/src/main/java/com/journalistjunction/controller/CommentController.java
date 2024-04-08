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

    @GetMapping
    public List<Comment> getAllComments() {
        return commentService.getAllComments();
    }

    @PostMapping
    public void postNewComment(@RequestBody Comment comment) {
        commentService.addComment(comment);
    }

    @DeleteMapping("/{id}")
    public void deleteComment(@PathVariable("id") Long id) {
        commentService.deleteCommentById(id);
    }
}
