package com.project.resume.Util;

import java.util.Locale;
import java.util.Set;

public class KeywordUtil {
    private static final Set<String>  DEFAULT_KEYWORDS = Set.of(
            "java","spring","spring boot","hibernate","jpa","mysql","rest","api","docker","kubernetes",
            "aws","git","ci/cd","microservices","rabbitmq","kafka","security","oauth","jwt"
    );

    public static int computerAtAcore(String text){
        if(text==null || text.isBlank()) return 0;
        String lower = text.toLowerCase(Locale.ROOT);
        long hits = DEFAULT_KEYWORDS.stream().filter(lower::contains).count();
        int score = (int) Math.min(100,hits*6);
        return Math.max(20,score);

    }
}
