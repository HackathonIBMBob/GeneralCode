package utils;

public class StringUtils {

    public static String join(String[] parts, String separator) {
        String result = "";
        for (int i = 0; i < parts.length; i++) {
            result = result + parts[i];
            if (i < parts.length - 1) {
                result = result + separator;
            }
        }
        return result;
    }

    public static String repeat(String str, int times) {
        String result = "";
        for (int i = 0; i < times; i++) {
            result = result + str;
        }
        return result;
    }

    public static String capitalize(String str) {
        if (str.length() == 0) {
            return str;
        }
        return str.substring(0, 1).toUpperCase() + str.substring(1).toLowerCase();
    }

    public static String capitalizeWords(String sentence) {
        String[] words = sentence.split(" ");
        String result = "";
        for (int i = 0; i < words.length; i++) {
            String word = words[i];
            if (word.length() == 0) {
                result = result + " ";
            } else {
                result = result + word.substring(0, 1).toUpperCase() + word.substring(1).toLowerCase();
                if (i < words.length - 1) {
                    result = result + " ";
                }
            }
        }
        return result;
    }

    public static boolean isEmpty(String str) {
        return str == null || str.length() == 0;
    }

    public static String trim(String str) {
        return str.trim();
    }

    public static String reverse(String str) {
        String result = "";
        for (int i = str.length() - 1; i >= 0; i--) {
            result = result + str.charAt(i);
        }
        return result;
    }

    public static int countOccurrences(String text, String word) {
        int count = 0;
        int index = 0;
        while (index != -1) {
            index = text.indexOf(word, index);
            if (index != -1) {
                count++;
                index += word.length();
            }
        }
        return count;
    }

    public static String removeSpaces(String str) {
        String result = "";
        for (int i = 0; i < str.length(); i++) {
            if (str.charAt(i) != ' ') {
                result = result + str.charAt(i);
            }
        }
        return result;
    }

    public static String toCamelCase(String str) {
        String[] parts = str.split("_");
        String result = parts[0].toLowerCase();
        for (int i = 1; i < parts.length; i++) {
            result = result + parts[i].substring(0, 1).toUpperCase() + parts[i].substring(1).toLowerCase();
        }
        return result;
    }

    public static String toSnakeCase(String str) {
        String result = "";
        for (int i = 0; i < str.length(); i++) {
            char c = str.charAt(i);
            if (Character.isUpperCase(c) && i > 0) {
                result = result + "_" + Character.toLowerCase(c);
            } else {
                result = result + Character.toLowerCase(c);
            }
        }
        return result;
    }

    public static String truncate(String str, int maxLength) {
        if (str.length() <= maxLength) {
            return str;
        }
        return str.substring(0, maxLength) + "...";
    }

    public static String padLeft(String str, int length, char padChar) {
        String result = str;
        while (result.length() < length) {
            result = padChar + result;
        }
        return result;
    }
}
