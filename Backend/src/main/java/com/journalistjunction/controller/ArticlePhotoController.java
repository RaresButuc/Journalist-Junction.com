package com.journalistjunction.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.journalistjunction.DTO.ChangeIsThumbnailStatusDTO;
import com.journalistjunction.model.PhotosClasses.ArticlePhoto;
import com.journalistjunction.service.ArticlePhotoService;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

@RestController
@AllArgsConstructor
@RequestMapping(value = "/article-photo")
public class ArticlePhotoController {

    private final ArticlePhotoService articlePhotoService;

    @GetMapping("/{id}")
    public ArticlePhoto getArticlePhotoById(@PathVariable("id") Long id) {
        return articlePhotoService.getArticlePhotoById(id);
    }

    @GetMapping("/is-any-other-thumbnail-uploaded-or-chosen/{isArticlePublished}/{isCurrentThumbnailDeleted}/{isAnyNewThumbnailUploaded}")
    public void dontDeleteThumbnailWithoutAddingOne(@PathVariable("isArticlePublished") boolean isArticlePublished,
                                                    @PathVariable("isCurrentThumbnailDeleted") boolean isCurrentThumbnailDeleted,
                                                    @PathVariable("isAnyNewThumbnailUploaded") boolean isAnyNewThumbnailUploaded) {
        articlePhotoService.dontDeleteThumbnailWithoutAddingOne(isArticlePublished, isCurrentThumbnailDeleted, isAnyNewThumbnailUploaded);
    }

    @GetMapping("/dont-unset-a-thumbnail-without-choosing-one/{isArticlePublished}/{isCurrentThumbnailUnset}/{isAnyNewThumbnailUploaded}")
    public void dontUnsetAThumbnailWithoutChoosingOne(@PathVariable("isArticlePublished") boolean isArticlePublished,
                                                      @PathVariable("isCurrentThumbnailUnset") boolean isCurrentThumbnailUnset,
                                                      @PathVariable("isAnyNewThumbnailUploaded") boolean isAnyNewThumbnailSet) {
        articlePhotoService.dontUnsetAThumbnailWithoutChoosingOne(isArticlePublished, isCurrentThumbnailUnset, isAnyNewThumbnailSet);
    }

    @PutMapping("/change-status/{id}")
    public void setPhotoAsThumbnailOrNot(@PathVariable("id") Long id, @RequestParam("decisions") List<String> decisions) {
        ObjectMapper mapper = new ObjectMapper();

        List<String> decisionsConfirmed = new ArrayList<>(decisions.isEmpty() ? Collections.emptyList() :
                decisions.size() == 1 ||
                        (decisions.get(0).startsWith("{") && !decisions.get(0).endsWith("{") &&
                                !decisions.get(1).startsWith("{") && decisions.get(1).endsWith("}")) ?
                        Collections.singletonList(decisions.get(0) + "," + decisions.get(1)) :
                        decisions);

        List<ChangeIsThumbnailStatusDTO> changeIsThumbnailStatusDTOList = decisionsConfirmed.stream().map(e -> {
            try {
                return mapper.readValue(e, ChangeIsThumbnailStatusDTO.class);
            } catch (JsonProcessingException ex) {
                throw new RuntimeException("An Error Has Occurred! Please Try Again Later!");
            }
        }).toList();

        articlePhotoService.setPhotoAsThumbnailOrNot(id, changeIsThumbnailStatusDTOList);
    }
}
