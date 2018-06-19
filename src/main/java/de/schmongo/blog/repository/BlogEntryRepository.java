package de.schmongo.blog.repository;

import de.schmongo.blog.domain.BlogEntry;
import org.springframework.stereotype.Repository;

import org.springframework.data.mongodb.repository.MongoRepository;

/**
 * Spring Data MongoDB repository for the BlogEntry entity.
 */
@SuppressWarnings("unused")
@Repository
public interface BlogEntryRepository extends MongoRepository<BlogEntry, String> {

}
