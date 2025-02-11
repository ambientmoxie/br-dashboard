<?php

class ElementBuilder
{
    // Generates options to select
    public static function createOptions(array $root, string $defaultKey): string
    {
        $folders = $root;
        $options = '';
        $counter = 0;

        foreach (array_keys($folders) as $key) {
            $label = str_replace('-', ' ', $key);
            $selected = strval($key) === $defaultKey ? '--selected' : '';
            $options .= "<button class=\"button-default {$selected}\" data-key=\"{$key}\">{$label}</button>";
            $counter++;
        }

        return $options;
    }

    // Generates radio buttons.
    public static function createRadioButtons(array $servedSizes): string
    {
        $radioButtons = "";
        foreach ($servedSizes as $banner) {
            $bannerWidth  = $banner[0];
            $bannerHeight = $banner[1];
            $radioButtons .= "
                <li class=\"banner-size-item\">
                    <button data-width=\"{$bannerWidth}\" data-height=\"{$bannerHeight}\" class=\"banner-size-button --selected\">
                        {$bannerWidth}x{$bannerHeight}
                    </button>
                </li>
            ";
        }

        return $radioButtons;
    }

    // Creates banners on the board
    public static function createBanners(array $servedSizes, string $defaultPathToFile): string
    {
        $banners = "";
        foreach ($servedSizes as $banner) {
            $bannerWidth  = $banner[0];
            $bannerHeight = $banner[1];
            $banners .= "
                <div class=\"banner\">
                <div class=\"banner__wrapper\"> 
                    <iframe src={$defaultPathToFile} width={$bannerWidth} height={$bannerHeight} frameborder=\"0\"></iframe>
                </div>
                <div class=\"banner__footer\">
                    <p>{$bannerWidth}x{$bannerHeight}</p>
                </div>
                </div>
                ";
        }
        return $banners;
    }
}
