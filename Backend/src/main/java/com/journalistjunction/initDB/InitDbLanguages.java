package com.journalistjunction.initDB;

import com.journalistjunction.model.Language;
import com.journalistjunction.repository.LanguageRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@AllArgsConstructor
public class InitDbLanguages {

    private final LanguageRepository languageRepository;

    public void seedDBLanguage() {
        List<Language> languages = List.of(
                Language.builder().languageNameEnglish("arabic").languageNameNative("العربية").cca2("SA").build(),
                Language.builder().languageNameEnglish("bengali").languageNameNative("বাংলা").cca2("BD").build(),
                Language.builder().languageNameEnglish("bulgarian").languageNameNative("Български").cca2("BG").build(),
                Language.builder().languageNameEnglish("chinese").languageNameNative("普通话").cca2("CN").build(),
                Language.builder().languageNameEnglish("croatian").languageNameNative("Hrvatski").cca2("HR").build(),
                Language.builder().languageNameEnglish("czech").languageNameNative("Čeština").cca2("CZ").build(),
                Language.builder().languageNameEnglish("danish").languageNameNative("Dansk").cca2("DK").build(),
                Language.builder().languageNameEnglish("dutch").languageNameNative("Nederlands").cca2("NL").build(),
                Language.builder().languageNameEnglish("english").languageNameNative("English").cca2("GB").build(),
                Language.builder().languageNameEnglish("estonian").languageNameNative("Eesti").cca2("EE").build(),
                Language.builder().languageNameEnglish("finnish").languageNameNative("Suomi").cca2("FI").build(),
                Language.builder().languageNameEnglish("french").languageNameNative("Français").cca2("FR").build(),
                Language.builder().languageNameEnglish("german").languageNameNative("Deutsch").cca2("DE").build(),
                Language.builder().languageNameEnglish("greek").languageNameNative("Ελληνικά").cca2("GR").build(),
                Language.builder().languageNameEnglish("hindi").languageNameNative("हिन्दी").cca2("IN").build(),
                Language.builder().languageNameEnglish("hungarian").languageNameNative("Magyar").cca2("HU").build(),
                Language.builder().languageNameEnglish("icelandic").languageNameNative("Íslenska").cca2("IS").build(),
                Language.builder().languageNameEnglish("indonesian").languageNameNative("Bahasa Indonesia").cca2("ID").build(),
                Language.builder().languageNameEnglish("irish").languageNameNative("Gaeilge").cca2("IE").build(),
                Language.builder().languageNameEnglish("italian").languageNameNative("Italiano").cca2("IT").build(),
                Language.builder().languageNameEnglish("japanese").languageNameNative("日本語").cca2("JP").build(),
                Language.builder().languageNameEnglish("korean").languageNameNative("한국어").cca2("KR").build(),
                Language.builder().languageNameEnglish("latvian").languageNameNative("Latviešu").cca2("LV").build(),
                Language.builder().languageNameEnglish("lithuanian").languageNameNative("Lietuvių").cca2("LT").build(),
                Language.builder().languageNameEnglish("malay").languageNameNative("Bahasa Melayu").cca2("MY").build(),
                Language.builder().languageNameEnglish("norwegian").languageNameNative("Norsk").cca2("NO").build(),
                Language.builder().languageNameEnglish("persian").languageNameNative("فارسی").cca2("IR").build(),
                Language.builder().languageNameEnglish("polish").languageNameNative("Polski").cca2("PL").build(),
                Language.builder().languageNameEnglish("portuguese").languageNameNative("Português").cca2("PT").build(),
                Language.builder().languageNameEnglish("punjabi").languageNameNative("ਪੰਜਾਬੀ").cca2("PK").build(),
                Language.builder().languageNameEnglish("romanian").languageNameNative("Română").cca2("RO").build(),
                Language.builder().languageNameEnglish("russian").languageNameNative("Русский").cca2("RU").build(),
                Language.builder().languageNameEnglish("scottish Gaelic").languageNameNative("Gàidhlig").cca2("GB").build(),
                Language.builder().languageNameEnglish("slovak").languageNameNative("Slovenčina").cca2("SK").build(),
                Language.builder().languageNameEnglish("slovenian").languageNameNative("Slovenščina").cca2("SI").build(),
                Language.builder().languageNameEnglish("spanish").languageNameNative("Español").cca2("ES").build(),
                Language.builder().languageNameEnglish("swedish").languageNameNative("Svenska").cca2("SE").build(),
                Language.builder().languageNameEnglish("thai").languageNameNative("ไทย").cca2("TH").build(),
                Language.builder().languageNameEnglish("turkish").languageNameNative("Türkçe").cca2("TR").build(),
                Language.builder().languageNameEnglish("vietnamese").languageNameNative("Tiếng Việt").cca2("VN").build(),
                Language.builder().languageNameEnglish("welsh").languageNameNative("Cymraeg").cca2("GB").build()
        );

        languageRepository.saveAllAndFlush(languages);
    }
}
