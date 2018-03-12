<?php
namespace Craft;

return [
    'endpoints' => [
        'api/blog.json' => [
            'elementType' => 'Entry',
            'elementsPerPage' => 9,
            'pageParam' => 'pg',
            'criteria' => ['section' => 'blog'],
            'transformer' => function(EntryModel $entry) {
                if (isset($entry->blogImage[0]))
                    $srcImage = $entry->blogImage[0];
                $imageUrl = "";
                if ($srcImage)
                {
                    craft()->config->set('generateTransformsBeforePageLoad', true);
                    if (craft()->plugins->getPlugin('Imager'))
                    {
                        $image = craft()->imager->transformImage($srcImage, [
                                'width' => 336,
                                'format' => 'jpg',
                                'ratio' => 2/1,
                                'allowUpscale' => false,
                                'mode' => 'crop',
                                'jpegQuality' => 60,
                                'position' => $srcImage->focusPctX() . '% ' . $srcImage->focusPctY() . '%',
                                'interlace' => true
                            ], null, null);
                        $imageUrl = $image->url;
                    }
                    else
                        $imageUrl = $srcImage->getUrl(['width' => 336, 'height' => 168]);
                }
                $categories = [];
                foreach ($entry->blogCategory as $cat)
                    $categories[] = $cat->title;
                $tags = [];
                foreach ($entry->blogTags as $tag)
                    $tags[] = $tag->title;
                return [
                    'title' => $entry->title,
                    'url' => $entry->url,
                ];
            },
        ],
    ]
];
