package com.beansteam.redditmyersbriggs;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.StringWriter;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.ArrayList;
import org.json.simple.*;
import org.json.simple.parser.JSONParser;
import org.json.simple.parser.ParseException;
import java.util.List;
import java.util.Map;
import io.indico.Indico;
import io.indico.api.text.Persona;
import io.indico.api.utils.IndicoException;
import java.util.HashMap;

/**
 *
 * @author BeansTeam
 */
public class Main {
    String subreddit;
    
    public Main(String subreddit) {
        this.subreddit = subreddit;
    }
    
    public static void main(String[] args) throws IndicoException, IOException {
        Main m = new Main("ESFJ");

        ArrayList<String> selfTexts = m.getText();
        
        List<Map<Persona, Double>> personaResults = m.personaAnalysis(selfTexts);
        
        Map<Persona, Double> averageArchetypes = m.averageArchetypes(personaResults);
        
        System.out.println(averageArchetypes);
    }
    
    
    
    public Map<Persona, Double> averageArchetypes(List<Map<Persona, Double>> personaResults) {
        Map<Persona, Double> averagePersonas = new HashMap<>();
        for (Persona persona : Persona.values()) {
            double total = 0;
            double setSize = 0;
            for (Map<Persona, Double> personaResult : personaResults) {
                total += personaResult.get(persona);
                setSize++;
            }
            averagePersonas.put(persona, total/setSize);
        }
        return averagePersonas;
    }
    
    public List<Map<Persona, Double>> personaAnalysis(ArrayList<String> selftexts) throws IndicoException, IOException {
        String apiKey = "a0fb001e73d90238c232cac782678907";
        
        Indico indico = new Indico(apiKey);
        
        return indico.persona.predict(selftexts).getPersona();
    }
    
    public ArrayList<String> getText() {
        ArrayList<String> redditSelfTexts = new ArrayList<>();
        try {
            redditSelfTexts = this.parse(this.parseRedditData());
        } catch (ParseException ex) {
            ex.printStackTrace();
        }
        return redditSelfTexts;
    }
    
    private ArrayList<String> parse(JSONObject data) {
        JSONArray texts = (JSONArray) data.get("data");
        ArrayList<String> parseTexts = new ArrayList<>();
        for (int i = 0; i < texts.size(); i++) {
            String selftext = (String)((JSONObject) texts.get(i)).get("selftext");
            if (selftext != null && !selftext.isEmpty()) parseTexts.add(selftext);
        }
        return parseTexts;
    }

    private JSONObject parseRedditData() throws ParseException {
        JSONParser parser = new JSONParser();

        return ((JSONObject) parser.parse(this.getRedditData()));
    }

    private String getRedditData() {
        String apiURI = "https://api.pushshift.io/reddit/search/submission/?subreddit=" + this.subreddit + "&sort_type=score&sort=desc&size=500";

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
