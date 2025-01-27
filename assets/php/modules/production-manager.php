<?php

class ProductionManager
{

    public static $passwords = [
        "shoe"    => "adidas",
        "bike"    => "decathlon",
        "beauty"  => "dior",
        "fashion" => "jacquemus",
        "paris"   => "louis-vuitton",
        "jordan"  => "nike",
    ];

    /**
     * This function parses and returns the content of any directory provided as an argument.
     * It returns an array representing the folder structure. In this case, it is used to 
     * generate a snapshot of the current project state. Since the user does not have the 
     * ability to modify the core project structure, the data from the production object will 
     * be used to update the UI based on user interactions throughout the session.
     */
    public static function parseDirectory(string $dirPath): array
    {
        $result = [];

        foreach (scandir($dirPath) as $item) {
            if ($item === '.' || $item === '..') {
                continue;
            }
            $stringItem = strval($item);
            $fullPath = $dirPath . DIRECTORY_SEPARATOR . $stringItem;

            if (is_dir($fullPath)) {
                $result[$stringItem] = self::parseDirectory($fullPath);
            } elseif (is_file($fullPath) && pathinfo($item, PATHINFO_EXTENSION) === 'html') {

                // Transform full path into usable path
                $startPos = strpos($fullPath, 'production'); // Find the position of "production"
                $cleanedPath = substr($fullPath, $startPos); // Extract the substring from "production"

                $result['html-file'] = $item;
                $result['path-to-file'] = $cleanedPath;
                $result['served-sizes'] = self::getServedSizes($fullPath);
            }
        }

        return $result;
    }

    /**
     * Returns an array of served-sizes by fetching and reading
     * the content of the gwd-served-sizes script tag.
     */
    public static function getServedSizes(string $filePath): array
    {

        if (!file_exists($filePath)) throw new Exception("File not found: $filePath");
        $fileContent = file_get_contents($filePath);

        // Extract JSON content inside the <script> tag with gwd-served-sizes
        if (preg_match('/<script[^>]*gwd-served-sizes=""[^>]*>(.*?)<\/script>/s', $fileContent, $matches)) {

            $sizesArray = json_decode($matches[1], true);
            $servedSizes = [];
            foreach ($sizesArray as $size) {
                $banner = explode("x", trim($size, '"'));
                array_push($servedSizes, $banner); // Add it to the final array {[0] => ..., [1] => ...} 
            }

            return $servedSizes;
            throw new Exception("Invalid JSON found in the <script> tag.");
        }
        throw new Exception("No <script> tag with gwd-served-sizes found.");
    }

    // Function to get the first or last key
    public static function getBoundaryKey(array $array, bool $getFirst = false): string
    {
        $keys = array_keys($array);
        $keys = array_values($keys);

        return $getFirst ? reset($keys) : end($keys);
    }
}
