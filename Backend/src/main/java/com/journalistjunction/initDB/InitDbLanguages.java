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
                Language.builder().languageNameEnglish("Arabic").languageNameNative("العربية").cca2("SA").build(),
                Language.builder().languageNameEnglish("Bengali").languageNameNative("বাংলা").cca2("BD").build(),
                Language.builder().languageNameEnglish("Bulgarian").languageNameNative("Български").cca2("BG").build(),
                Language.builder().languageNameEnglish("Chinese").languageNameNative("普通话").cca2("CN").build(),
                Language.builder().languageNameEnglish("Croatian").languageNameNative("Hrvatski").cca2("HR").build(),
                Language.builder().languageNameEnglish("Czech").languageNameNative("Čeština").cca2("CZ").build(),
                Language.builder().languageNameEnglish("Danish").languageNameNative("Dansk").cca2("DK").build(),
                Language.builder().languageNameEnglish("Dutch").languageNameNative("Nederlands").cca2("NL").build(),
                Language.builder().languageNameEnglish("English").languageNameNative("English").cca2("GB").build(),
                Language.builder().languageNameEnglish("Estonian").languageNameNative("Eesti").cca2("EE").build(),
                Language.builder().languageNameEnglish("Finnish").languageNameNative("Suomi").cca2("FI").build(),
                Language.builder().languageNameEnglish("French").languageNameNative("Français").cca2("FR").build(),
                Language.builder().languageNameEnglish("German").languageNameNative("Deutsch").cca2("DE").build(),
                Language.builder().languageNameEnglish("Greek").languageNameNative("Ελληνικά").cca2("GR").build(),
                Language.builder().languageNameEnglish("Hindi").languageNameNative("हिन्दी").cca2("IN").build(),
                Language.builder().languageNameEnglish("Hungarian").languageNameNative("Magyar").cca2("HU").build(),
                Language.builder().languageNameEnglish("Icelandic").languageNameNative("Íslenska").cca2("IS").build(),
                Language.builder().languageNameEnglish("Indonesian").languageNameNative("Bahasa Indonesia").cca2("ID").build(),
                Language.builder().languageNameEnglish("Irish").languageNameNative("Gaeilge").cca2("IE").build(),
                Language.builder().languageNameEnglish("Italian").languageNameNative("Italiano").cca2("IT").build(),
                Language.builder().languageNameEnglish("Japanese").languageNameNative("日本語").cca2("JP").build(),
                Language.builder().languageNameEnglish("Korean").languageNameNative("한국어").cca2("KR").build(),
                Language.builder().languageNameEnglish("Latvian").languageNameNative("Latviešu").cca2("LV").build(),
                Language.builder().languageNameEnglish("Lithuanian").languageNameNative("Lietuvių").cca2("LT").build(),
                Language.builder().languageNameEnglish("Malay").languageNameNative("Bahasa Melayu").cca2("MY").build(),
                Language.builder().languageNameEnglish("Norwegian").languageNameNative("Norsk").cca2("NO").build(),
                Language.builder().languageNameEnglish("Persian").languageNameNative("فارسی").cca2("IR").build(),
                Language.builder().languageNameEnglish("Polish").languageNameNative("Polski").cca2("PL").build(),
                Language.builder().languageNameEnglish("Portuguese").languageNameNative("Português").cca2("PT").build(),
                Language.builder().languageNameEnglish("Punjabi").languageNameNative("ਪੰਜਾਬੀ").cca2("PK").build(),
                Language.builder().languageNameEnglish("Romanian").languageNameNative("Română").cca2("RO").build(),
                Language.builder().languageNameEnglish("Russian").languageNameNative("Русский").cca2("RU").build(),
                Language.builder().languageNameEnglish("Scottish Gaelic").languageNameNative("Gàidhlig").cca2("GB").build(),
                Language.builder().languageNameEnglish("Slovak").languageNameNative("Slovenčina").cca2("SK").build(),
                Language.builder().languageNameEnglish("Slovenian").languageNameNative("Slovenščina").cca2("SI").build(),
                Language.builder().languageNameEnglish("Spanish").languageNameNative("Español").cca2("ES").build(),
                Language.builder().languageNameEnglish("Swedish").languageNameNative("Svenska").cca2("SE").build(),
                Language.builder().languageNameEnglish("Thai").languageNameNative("ไทย").cca2("TH").build(),
                Language.builder().languageNameEnglish("Turkish").languageNameNative("Türkçe").cca2("TR").build(),
                Language.builder().languageNameEnglish("Vietnamese").languageNameNative("Tiếng Việt").cca2("VN").build(),
                Language.builder().languageNameEnglish("Welsh").languageNameNative("Cymraeg").cca2("GB").build()
        );

        languageRepository.saveAll(languages);
    }
}
