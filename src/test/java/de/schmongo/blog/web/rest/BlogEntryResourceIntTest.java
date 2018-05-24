package de.schmongo.blog.web.rest;

import de.schmongo.blog.SchmongoBlogApp;

import de.schmongo.blog.domain.BlogEntry;
import de.schmongo.blog.repository.BlogEntryRepository;
import de.schmongo.blog.web.rest.errors.ExceptionTranslator;

import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.MockitoAnnotations;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.web.PageableHandlerMethodArgumentResolver;
import org.springframework.http.MediaType;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.util.Base64Utils;

import java.time.LocalDate;
import java.time.ZoneId;
import java.util.List;

import static de.schmongo.blog.web.rest.TestUtil.createFormattingConversionService;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Test class for the BlogEntryResource REST controller.
 *
 * @see BlogEntryResource
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes = SchmongoBlogApp.class)
public class BlogEntryResourceIntTest {

    private static final String DEFAULT_TITLE = "AAAAAAAAAA";
    private static final String UPDATED_TITLE = "BBBBBBBBBB";

    private static final String DEFAULT_TEXT = "AAAAAAAAAA";
    private static final String UPDATED_TEXT = "BBBBBBBBBB";

    private static final byte[] DEFAULT_PICTURE = TestUtil.createByteArray(1, "0");
    private static final byte[] UPDATED_PICTURE = TestUtil.createByteArray(2, "1");
    private static final String DEFAULT_PICTURE_CONTENT_TYPE = "image/jpg";
    private static final String UPDATED_PICTURE_CONTENT_TYPE = "image/png";

    private static final byte[] DEFAULT_THUMBNAIL = TestUtil.createByteArray(1, "0");
    private static final byte[] UPDATED_THUMBNAIL = TestUtil.createByteArray(2, "1");
    private static final String DEFAULT_THUMBNAIL_CONTENT_TYPE = "image/jpg";
    private static final String UPDATED_THUMBNAIL_CONTENT_TYPE = "image/png";

    private static final LocalDate DEFAULT_DATE = LocalDate.ofEpochDay(0L);
    private static final LocalDate UPDATED_DATE = LocalDate.now(ZoneId.systemDefault());

    private static final String DEFAULT_SHORT_DESCRIPTION = "AAAAAAAAAA";
    private static final String UPDATED_SHORT_DESCRIPTION = "BBBBBBBBBB";

    private static final byte[] DEFAULT_PICTURES = TestUtil.createByteArray(1, "0");
    private static final byte[] UPDATED_PICTURES = TestUtil.createByteArray(2, "1");
    private static final String DEFAULT_PICTURES_CONTENT_TYPE = "image/jpg";
    private static final String UPDATED_PICTURES_CONTENT_TYPE = "image/png";

    @Autowired
    private BlogEntryRepository blogEntryRepository;

    @Autowired
    private MappingJackson2HttpMessageConverter jacksonMessageConverter;

    @Autowired
    private PageableHandlerMethodArgumentResolver pageableArgumentResolver;

    @Autowired
    private ExceptionTranslator exceptionTranslator;

    private MockMvc restBlogEntryMockMvc;

    private BlogEntry blogEntry;

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final BlogEntryResource blogEntryResource = new BlogEntryResource(blogEntryRepository);
        this.restBlogEntryMockMvc = MockMvcBuilders.standaloneSetup(blogEntryResource)
            .setCustomArgumentResolvers(pageableArgumentResolver)
            .setControllerAdvice(exceptionTranslator)
            .setConversionService(createFormattingConversionService())
            .setMessageConverters(jacksonMessageConverter).build();
    }

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static BlogEntry createEntity() {
        BlogEntry blogEntry = new BlogEntry()
            .title(DEFAULT_TITLE)
            .text(DEFAULT_TEXT)
            .picture(DEFAULT_PICTURE)
            .pictureContentType(DEFAULT_PICTURE_CONTENT_TYPE)
            .thumbnail(DEFAULT_THUMBNAIL)
            .thumbnailContentType(DEFAULT_THUMBNAIL_CONTENT_TYPE)
            .date(DEFAULT_DATE)
            .shortDescription(DEFAULT_SHORT_DESCRIPTION)
            .pictures(DEFAULT_PICTURES)
            .picturesContentType(DEFAULT_PICTURES_CONTENT_TYPE);
        return blogEntry;
    }

    @Before
    public void initTest() {
        blogEntryRepository.deleteAll();
        blogEntry = createEntity();
    }

    @Test
    public void createBlogEntry() throws Exception {
        int databaseSizeBeforeCreate = blogEntryRepository.findAll().size();

        // Create the BlogEntry
        restBlogEntryMockMvc.perform(post("/api/blog-entries")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(blogEntry)))
            .andExpect(status().isCreated());

        // Validate the BlogEntry in the database
        List<BlogEntry> blogEntryList = blogEntryRepository.findAll();
        assertThat(blogEntryList).hasSize(databaseSizeBeforeCreate + 1);
        BlogEntry testBlogEntry = blogEntryList.get(blogEntryList.size() - 1);
        assertThat(testBlogEntry.getTitle()).isEqualTo(DEFAULT_TITLE);
        assertThat(testBlogEntry.getText()).isEqualTo(DEFAULT_TEXT);
        assertThat(testBlogEntry.getPicture()).isEqualTo(DEFAULT_PICTURE);
        assertThat(testBlogEntry.getPictureContentType()).isEqualTo(DEFAULT_PICTURE_CONTENT_TYPE);
        assertThat(testBlogEntry.getThumbnail()).isEqualTo(DEFAULT_THUMBNAIL);
        assertThat(testBlogEntry.getThumbnailContentType()).isEqualTo(DEFAULT_THUMBNAIL_CONTENT_TYPE);
        assertThat(testBlogEntry.getDate()).isEqualTo(DEFAULT_DATE);
        assertThat(testBlogEntry.getShortDescription()).isEqualTo(DEFAULT_SHORT_DESCRIPTION);
        assertThat(testBlogEntry.getPictures()).isEqualTo(DEFAULT_PICTURES);
        assertThat(testBlogEntry.getPicturesContentType()).isEqualTo(DEFAULT_PICTURES_CONTENT_TYPE);
    }

    @Test
    public void createBlogEntryWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = blogEntryRepository.findAll().size();

        // Create the BlogEntry with an existing ID
        blogEntry.setId("existing_id");

        // An entity with an existing ID cannot be created, so this API call must fail
        restBlogEntryMockMvc.perform(post("/api/blog-entries")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(blogEntry)))
            .andExpect(status().isBadRequest());

        // Validate the BlogEntry in the database
        List<BlogEntry> blogEntryList = blogEntryRepository.findAll();
        assertThat(blogEntryList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    public void getAllBlogEntries() throws Exception {
        // Initialize the database
        blogEntryRepository.save(blogEntry);

        // Get all the blogEntryList
        restBlogEntryMockMvc.perform(get("/api/blog-entries?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(blogEntry.getId())))
            .andExpect(jsonPath("$.[*].title").value(hasItem(DEFAULT_TITLE.toString())))
            .andExpect(jsonPath("$.[*].text").value(hasItem(DEFAULT_TEXT.toString())))
            .andExpect(jsonPath("$.[*].pictureContentType").value(hasItem(DEFAULT_PICTURE_CONTENT_TYPE)))
            .andExpect(jsonPath("$.[*].picture").value(hasItem(Base64Utils.encodeToString(DEFAULT_PICTURE))))
            .andExpect(jsonPath("$.[*].thumbnailContentType").value(hasItem(DEFAULT_THUMBNAIL_CONTENT_TYPE)))
            .andExpect(jsonPath("$.[*].thumbnail").value(hasItem(Base64Utils.encodeToString(DEFAULT_THUMBNAIL))))
            .andExpect(jsonPath("$.[*].date").value(hasItem(DEFAULT_DATE.toString())))
            .andExpect(jsonPath("$.[*].shortDescription").value(hasItem(DEFAULT_SHORT_DESCRIPTION.toString())))
            .andExpect(jsonPath("$.[*].picturesContentType").value(hasItem(DEFAULT_PICTURES_CONTENT_TYPE)))
            .andExpect(jsonPath("$.[*].pictures").value(hasItem(Base64Utils.encodeToString(DEFAULT_PICTURES))));
    }

    @Test
    public void getBlogEntry() throws Exception {
        // Initialize the database
        blogEntryRepository.save(blogEntry);

        // Get the blogEntry
        restBlogEntryMockMvc.perform(get("/api/blog-entries/{id}", blogEntry.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(blogEntry.getId()))
            .andExpect(jsonPath("$.title").value(DEFAULT_TITLE.toString()))
            .andExpect(jsonPath("$.text").value(DEFAULT_TEXT.toString()))
            .andExpect(jsonPath("$.pictureContentType").value(DEFAULT_PICTURE_CONTENT_TYPE))
            .andExpect(jsonPath("$.picture").value(Base64Utils.encodeToString(DEFAULT_PICTURE)))
            .andExpect(jsonPath("$.thumbnailContentType").value(DEFAULT_THUMBNAIL_CONTENT_TYPE))
            .andExpect(jsonPath("$.thumbnail").value(Base64Utils.encodeToString(DEFAULT_THUMBNAIL)))
            .andExpect(jsonPath("$.date").value(DEFAULT_DATE.toString()))
            .andExpect(jsonPath("$.shortDescription").value(DEFAULT_SHORT_DESCRIPTION.toString()))
            .andExpect(jsonPath("$.picturesContentType").value(DEFAULT_PICTURES_CONTENT_TYPE))
            .andExpect(jsonPath("$.pictures").value(Base64Utils.encodeToString(DEFAULT_PICTURES)));
    }

    @Test
    public void getNonExistingBlogEntry() throws Exception {
        // Get the blogEntry
        restBlogEntryMockMvc.perform(get("/api/blog-entries/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    public void updateBlogEntry() throws Exception {
        // Initialize the database
        blogEntryRepository.save(blogEntry);
        int databaseSizeBeforeUpdate = blogEntryRepository.findAll().size();

        // Update the blogEntry
        BlogEntry updatedBlogEntry = blogEntryRepository.findOne(blogEntry.getId());
        updatedBlogEntry
            .title(UPDATED_TITLE)
            .text(UPDATED_TEXT)
            .picture(UPDATED_PICTURE)
            .pictureContentType(UPDATED_PICTURE_CONTENT_TYPE)
            .thumbnail(UPDATED_THUMBNAIL)
            .thumbnailContentType(UPDATED_THUMBNAIL_CONTENT_TYPE)
            .date(UPDATED_DATE)
            .shortDescription(UPDATED_SHORT_DESCRIPTION)
            .pictures(UPDATED_PICTURES)
            .picturesContentType(UPDATED_PICTURES_CONTENT_TYPE);

        restBlogEntryMockMvc.perform(put("/api/blog-entries")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedBlogEntry)))
            .andExpect(status().isOk());

        // Validate the BlogEntry in the database
        List<BlogEntry> blogEntryList = blogEntryRepository.findAll();
        assertThat(blogEntryList).hasSize(databaseSizeBeforeUpdate);
        BlogEntry testBlogEntry = blogEntryList.get(blogEntryList.size() - 1);
        assertThat(testBlogEntry.getTitle()).isEqualTo(UPDATED_TITLE);
        assertThat(testBlogEntry.getText()).isEqualTo(UPDATED_TEXT);
        assertThat(testBlogEntry.getPicture()).isEqualTo(UPDATED_PICTURE);
        assertThat(testBlogEntry.getPictureContentType()).isEqualTo(UPDATED_PICTURE_CONTENT_TYPE);
        assertThat(testBlogEntry.getThumbnail()).isEqualTo(UPDATED_THUMBNAIL);
        assertThat(testBlogEntry.getThumbnailContentType()).isEqualTo(UPDATED_THUMBNAIL_CONTENT_TYPE);
        assertThat(testBlogEntry.getDate()).isEqualTo(UPDATED_DATE);
        assertThat(testBlogEntry.getShortDescription()).isEqualTo(UPDATED_SHORT_DESCRIPTION);
        assertThat(testBlogEntry.getPictures()).isEqualTo(UPDATED_PICTURES);
        assertThat(testBlogEntry.getPicturesContentType()).isEqualTo(UPDATED_PICTURES_CONTENT_TYPE);
    }

    @Test
    public void updateNonExistingBlogEntry() throws Exception {
        int databaseSizeBeforeUpdate = blogEntryRepository.findAll().size();

        // Create the BlogEntry

        // If the entity doesn't have an ID, it will be created instead of just being updated
        restBlogEntryMockMvc.perform(put("/api/blog-entries")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(blogEntry)))
            .andExpect(status().isCreated());

        // Validate the BlogEntry in the database
        List<BlogEntry> blogEntryList = blogEntryRepository.findAll();
        assertThat(blogEntryList).hasSize(databaseSizeBeforeUpdate + 1);
    }

    @Test
    public void deleteBlogEntry() throws Exception {
        // Initialize the database
        blogEntryRepository.save(blogEntry);
        int databaseSizeBeforeDelete = blogEntryRepository.findAll().size();

        // Get the blogEntry
        restBlogEntryMockMvc.perform(delete("/api/blog-entries/{id}", blogEntry.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isOk());

        // Validate the database is empty
        List<BlogEntry> blogEntryList = blogEntryRepository.findAll();
        assertThat(blogEntryList).hasSize(databaseSizeBeforeDelete - 1);
    }

    @Test
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(BlogEntry.class);
        BlogEntry blogEntry1 = new BlogEntry();
        blogEntry1.setId("id1");
        BlogEntry blogEntry2 = new BlogEntry();
        blogEntry2.setId(blogEntry1.getId());
        assertThat(blogEntry1).isEqualTo(blogEntry2);
        blogEntry2.setId("id2");
        assertThat(blogEntry1).isNotEqualTo(blogEntry2);
        blogEntry1.setId(null);
        assertThat(blogEntry1).isNotEqualTo(blogEntry2);
    }
}
