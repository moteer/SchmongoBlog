package de.schmongo.blog.web.rest;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.codahale.metrics.annotation.Timed;
import de.schmongo.blog.repository.BlogEntryRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;


/**
 * REST controller for managing BlogEntry.
 */
@RestController
@RequestMapping("/api")
public class CloudImagesResource {

    private final Logger log = LoggerFactory.getLogger(CloudImagesResource.class);

    private static final String ENTITY_NAME = "blogEntry";

    private final BlogEntryRepository blogEntryRepository;
    public CloudImagesResource(BlogEntryRepository blogEntryRepository) {
        this.blogEntryRepository = blogEntryRepository;
    }

    private Map<String, List<String>> imageUrlsByTag = null;

    /**
     * GET  /imageurls : get all the blogEntries.
     *
     * @return the ResponseEntity with status 200 (OK) and the list of blogEntries in body
     */
    @GetMapping("/imageurls")
    @Timed
    public Map<String, List<String>> getAllBlogEntries() {
        log.debug("REST request to get all imageurls");
        retrieveImageUrlsFromCloudIfNeeded();
        return imageUrlsByTag;
    }

    /**
     * GET  /imageurls/invalidate : get all the blogEntries.
     *
     * @return the ResponseEntity with status 200 (OK) and the list of blogEntries in body
     */
    @GetMapping("/imageurls/invalidate")
    @Timed
    public Map<String, List<String>> getInvalidateAndReload() {
        log.debug("REST request to invalidate all imageurls");
        invalidate();
        retrieveImageUrlsFromCloudIfNeeded();
        return imageUrlsByTag;
    }

    private void invalidate() {
        imageUrlsByTag = null;
    }

    private void retrieveImageUrlsFromCloudIfNeeded() {
        if (imageUrlsByTag == null) {

            // TODO: Never commit this !!!
            // TODO: Never commit this !!!
            // TODO: Never commit this !!!
            Cloudinary cloudinary = new Cloudinary(
                ObjectUtils.asMap(
                    "cloud_name", "",
                    "api_key", "",
                    "api_secret", ""));
            // TODO: Never commit this !!!
            // TODO: Never commit this !!!
            // TODO: Never commit this !!!

            imageUrlsByTag = new HashMap<>();
            try {
                List<String> tags = (ArrayList<String>)cloudinary.api().tags(ObjectUtils.emptyMap()).get("tags");

                for (String tag : tags) {
                    List imageResourcesByTag = (ArrayList)cloudinary.api().resourcesByTag(tag, ObjectUtils.asMap("resource_type", "image")).get("resources");
                    imageResourcesByTag.forEach(imageResource -> {
                    List<String> imageResources = imageUrlsByTag.get(tag);
                    if (imageResources == null) {
                        imageResources = new ArrayList<>();
                        imageUrlsByTag.put(tag, imageResources);
                    }
                            String url = ((HashMap) imageResource).get("url").toString();
                        imageResources.add(url);
                });
                }
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
    }
}
