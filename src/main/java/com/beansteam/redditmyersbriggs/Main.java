package com.beansteam.redditmyersbriggs;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.StringWriter;
import java.net.HttpURLConnection;
import java.net.URL;
import org.json.simple.*;
import org.json.simple.parser.JSONParser;
import org.json.simple.parser.ParseException;

/**
 *
 * @author BeansTeam
 */
public class Main {
    public static void main(String[] args) {
        
    }
    
    public JSONObject parseRedditData() throws ParseException {
        JSONParser parser = new JSONParser();
        
        String result = "";
        
        JSONObject data = ((JSONObject)parser.parse(result));
        
        return data;
    }
    
    public String getRedditData() {
        String subreddit = "intj";
        String apiURI = "https://api.pushshift.io/reddit/search/submission/?subreddit=" + subreddit + "&sort_type=score&sort=desc&size=500";
        
        StringWriter result = new StringWriter();
        try {
            URL url = new URL(apiURI);
            HttpURLConnection con = (HttpURLConnection) url.openConnection();
            con.setRequestMethod("GET");

            try (BufferedReader rd = new BufferedReader(new InputStreamReader(con.getInputStream()))) {
                String line;
                while ((line = rd.readLine()) != null) {
                    result.append(line);
                }
            }
            con.disconnect();
        } catch (IOException e) {
            e.printStackTrace();
        }
        
        return result.toString();
    }
}
