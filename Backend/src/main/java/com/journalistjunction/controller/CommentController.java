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

    @PostMapping("/new-comm")
    public void postNewComment(@RequestBody Comment comment) {
        commentService.addNewComment(comment);
    }

    @PostMapping("/child-comm/{parentCommId}")
    public void postChildComment(@RequestBody Comment comment, @PathVariable Long parentCommId) {
        commentService.addChildComment(comment, parentCommId);
    }

    @PutMapping("/edit/{id}")
    public void editComment(@RequestBody Comment comment, @PathVariable Long id) {
        commentService.editComment(comment, id);
    }

    @DeleteMapping("/{id}")
    public void deleteComment(@PathVariable("id") Long id) {
        commentService.deleteCommentById(id);
    }
}
