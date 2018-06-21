package de.schmongo.blog.domain;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Field;
import org.springframework.data.mongodb.core.mapping.Document;

import java.io.Serializable;
import java.time.LocalDate;
import java.util.Objects;

/**
 * A BlogEntry.
 */
@Document(collection = "blog_entry")
public class BlogEntry implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    private String id;

    @Field("title")
    private String title;

    @Field("text")
    private String text;

    @Field("picture")
    private byte[] picture;

    @Field("picture_content_type")
    private String pictureContentType;

    @Field("thumbnail")
    private byte[] thumbnail;

    @Field("thumbnail_content_type")
    private String thumbnailContentType;

    @Field("date")
    private LocalDate date;

    @Field("short_description")
    private String shortDescription;

    @Field("pictures")
    private byte[] pictures;

    @Field("pictures_content_type")
    private String picturesContentType;

    @Field("author")
    private String author;

    @Field("cloud_directory")
    private String cloudDirectory;

    @Field("category")
    private String category;

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public BlogEntry title(String title) {
        this.title = title;
        return this;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getText() {
        return text;
    }

    public BlogEntry text(String text) {
        this.text = text;
        return this;
    }

    public void setText(String text) {
        this.text = text;
    }

    public byte[] getPicture() {
        return picture;
    }

    public BlogEntry picture(byte[] picture) {
        this.picture = picture;
        return this;
    }

    public void setPicture(byte[] picture) {
        this.picture = picture;
    }

    public String getPictureContentType() {
        return pictureContentType;
    }

    public BlogEntry pictureContentType(String pictureContentType) {
        this.pictureContentType = pictureContentType;
        return this;
    }

    public void setPictureContentType(String pictureContentType) {
        this.pictureContentType = pictureContentType;
    }

    public byte[] getThumbnail() {
        return thumbnail;
    }

    public BlogEntry thumbnail(byte[] thumbnail) {
        this.thumbnail = thumbnail;
        return this;
    }

    public void setThumbnail(byte[] thumbnail) {
        this.thumbnail = thumbnail;
    }

    public String getThumbnailContentType() {
        return thumbnailContentType;
    }

    public BlogEntry thumbnailContentType(String thumbnailContentType) {
        this.thumbnailContentType = thumbnailContentType;
        return this;
    }

    public void setThumbnailContentType(String thumbnailContentType) {
        this.thumbnailContentType = thumbnailContentType;
    }

    public LocalDate getDate() {
        return date;
    }

    public BlogEntry date(LocalDate date) {
        this.date = date;
        return this;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    public String getShortDescription() {
        return shortDescription;
    }

    public BlogEntry shortDescription(String shortDescription) {
        this.shortDescription = shortDescription;
        return this;
    }

    public void setShortDescription(String shortDescription) {
        this.shortDescription = shortDescription;
    }

    public byte[] getPictures() {
        return pictures;
    }

    public BlogEntry pictures(byte[] pictures) {
        this.pictures = pictures;
        return this;
    }

    public void setPictures(byte[] pictures) {
        this.pictures = pictures;
    }

    public String getPicturesContentType() {
        return picturesContentType;
    }

    public BlogEntry picturesContentType(String picturesContentType) {
        this.picturesContentType = picturesContentType;
        return this;
    }

    public void setPicturesContentType(String picturesContentType) {
        this.picturesContentType = picturesContentType;
    }

    public String getAuthor() {
        return author;
    }

    public BlogEntry author(String author) {
        this.author = author;
        return this;
    }

    public void setAuthor(String author) {
        this.author = author;
    }

    public String getCloudDirectory() {
        return cloudDirectory;
    }

    public BlogEntry cloudDirectory(String cloudDirectory) {
        this.cloudDirectory = cloudDirectory;
        return this;
    }

    public void setCloudDirectory(String cloudDirectory) {
        this.cloudDirectory = cloudDirectory;
    }

    public String getCategory() {
        return category;
    }

    public BlogEntry category(String category) {
        this.category = category;
        return this;
    }

    public void setCategory(String category) {
        this.category = category;
    }
    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here, do not remove

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        BlogEntry blogEntry = (BlogEntry) o;
        if (blogEntry.getId() == null || getId() == null) {
            return false;
        }
        return Objects.equals(getId(), blogEntry.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(getId());
    }

    @Override
    public String toString() {
        return "BlogEntry{" +
            "id=" + getId() +
            ", title='" + getTitle() + "'" +
            ", text='" + getText() + "'" +
            ", picture='" + getPicture() + "'" +
            ", pictureContentType='" + getPictureContentType() + "'" +
            ", thumbnail='" + getThumbnail() + "'" +
            ", thumbnailContentType='" + getThumbnailContentType() + "'" +
            ", date='" + getDate() + "'" +
            ", shortDescription='" + getShortDescription() + "'" +
            ", pictures='" + getPictures() + "'" +
            ", picturesContentType='" + getPicturesContentType() + "'" +
            ", author='" + getAuthor() + "'" +
            ", cloudDirectory='" + getCloudDirectory() + "'" +
            ", category='" + getCategory() + "'" +
            "}";
    }
}
