package de.schmongo.blog.web.rest;

import com.codahale.metrics.annotation.Timed;
import de.schmongo.blog.domain.BlogEntry;
import de.schmongo.blog.repository.BlogEntryRepository;
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.net.URL;
import java.net.URLConnection;
import java.util.*;
import org.json.simple.parser.JSONParser;



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

    /**
     * GET  /imageurls : get all the blogEntries.
     *
     * @return the ResponseEntity with status 200 (OK) and the list of blogEntries in body
     */
    @GetMapping("/imageurls")
    @Timed
    public Map<String, List<String>> getAllBlogEntries() {
        log.debug("REST request to get all imageurls");
        List<BlogEntry> blogEntries = blogEntryRepository.findAll();

        Set<String> cloudDirectories = new HashSet<>();
        blogEntries.stream().forEach(blogEntry -> {

            if(blogEntry.getCloudDirectory() != null && !"".equals(blogEntry.getCloudDirectory())) {
                cloudDirectories.add(blogEntry.getCloudDirectory());
            }});

        HashMap<String, List<String>> imageUrls = new HashMap<>();
        cloudDirectories.stream()
            .forEach(cloudDirectory -> imageUrls.put(cloudDirectory, findImageUrlsFor(cloudDirectory)));

        return imageUrls;
    }

    JSONParser parser = new JSONParser();

    private List<String> findImageUrlsFor(String cloudDirectory) {
        System.out.println("try to findImageUrlsFor for " + cloudDirectory);
        // todo: read credentials from local/prod properties
        String username = "";
        String password = "";
        try {

            String httpResponse = getHttpResponse("https://api.cloudinary.com/api/v1_1/hj2nrtgsf/resources/image/upload/?prefix=" + cloudDirectory,
                username,
                password);


            List<String> imageUrls = new ArrayList<>();
            Object obj = parser.parse(httpResponse);

            JSONObject jsonObject = (JSONObject) obj;
            System.out.println(jsonObject);


            // loop array
            JSONArray resources = (JSONArray) jsonObject.get("resources");
            Iterator<JSONObject> iterator = resources.iterator();
            System.out.println("#### CLoudDirectory: " + cloudDirectory + ": ");
            while (iterator.hasNext()) {
                JSONObject image = iterator.next();
                imageUrls.add(image.get("url").toString());
                System.out.println(image.get("url").toString());
            }

            return imageUrls;


        } catch (Exception e) {
            log.warn("Could not fetch image urls!");
            e.printStackTrace();
        }

        return Collections.emptyList();
    }

    public String getHttpResponse(String address, String username, String password) throws Exception {
        URL url = new URL(address);
        URLConnection conn = url.openConnection();
        conn.setConnectTimeout(30000); // 30 seconds time out

        log.info("HTTP GET: " + address);

        if (username != null && password != null){
            String user_pass = username + ":" + password;
            String encoded = Base64.getEncoder().encodeToString( user_pass.getBytes() );
            conn.setRequestProperty("Authorization", "Basic " + encoded);
        }

        String line = "";
        StringBuffer sb = new StringBuffer();
        BufferedReader input = new BufferedReader(new InputStreamReader(conn.getInputStream()) );
        while((line = input.readLine()) != null)
            sb.append(line);
        input.close();
        return sb.toString();
    }

}
