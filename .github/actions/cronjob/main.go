package main

import (
	"encoding/json"
	"io/ioutil"
	"log"
	"time"

	fditch "github.com/ShaigroRB/go-free-discount-itch"
)

type itchioItems struct {
	GameAssets    []fditch.Item `json:"game-assets"`
	Books         []fditch.Item `json:"books"`
	Comics        []fditch.Item `json:"comics"`
	Tools         []fditch.Item `json:"tools"`
	Games         []fditch.Item `json:"games"`
	PhysicalGames []fditch.Item `json:"physical-games"`
	Soundtracks   []fditch.Item `json:"soundtracks"`
	GameMods      []fditch.Item `json:"game-mods"`
	Misc          []fditch.Item `json:"misc"`
}

func itchioItemsToJSON(itchioItems itchioItems) string {
	b, err := json.Marshal(itchioItems)
	if err != nil {
		panic(err)
	}
	return string(b)
}

func logItems(itchioItems itchioItems) {
	log.Println("all game-assets:")
	for _, item := range itchioItems.GameAssets {
		log.Println(item.Link)
	}
	log.Println("all books:")
	for _, item := range itchioItems.Books {
		log.Println(item.Link)
	}
	log.Println("all comics:")
	for _, item := range itchioItems.Comics {
		log.Println(item.Link)
	}
	log.Println("all tools:")
	for _, item := range itchioItems.Tools {
		log.Println(item.Link)
	}
	log.Println("all games:")
	for _, item := range itchioItems.Games {
		log.Println(item.Link)
	}
	log.Println("all physical-games:")
	for _, item := range itchioItems.PhysicalGames {
		log.Println(item.Link)
	}
	log.Println("all soundtracks:")
	for _, item := range itchioItems.Soundtracks {
		log.Println(item.Link)
	}
	log.Println("all game-mods:")
	for _, item := range itchioItems.GameMods {
		log.Println(item.Link)
	}
	log.Println("all misc:")
	for _, item := range itchioItems.Misc {
		log.Println(item.Link)
	}
}

func main() {
	// init empty lists for each category
	result := itchioItems{
		GameAssets:    []fditch.Item{},
		Books:         []fditch.Item{},
		Comics:        []fditch.Item{},
		Tools:         []fditch.Item{},
		Games:         []fditch.Item{},
		PhysicalGames: []fditch.Item{},
		Soundtracks:   []fditch.Item{},
		GameMods:      []fditch.Item{},
		Misc:          []fditch.Item{},
	}
	// get all items that are on 100% discount as json
	for _, category := range fditch.Categories {
		time.Sleep(1 * time.Second)
		log.Println("Getting items for category:", category)
		items, err := fditch.GetCategoryItems(category)

		if err != nil {
			log.Println(err)
		} else {
			switch category {
			case fditch.GameAssets:
				result.GameAssets = append(result.GameAssets, items...)
			case fditch.Books:
				result.Books = append(result.Books, items...)
			case fditch.Comics:
				result.Comics = append(result.Comics, items...)
			case fditch.Tools:
				result.Tools = append(result.Tools, items...)
			case fditch.Games:
				result.Games = append(result.Games, items...)
			case fditch.PhysicalGames:
				result.PhysicalGames = append(result.PhysicalGames, items...)
			case fditch.Soundtracks:
				result.Soundtracks = append(result.Soundtracks, items...)
			case fditch.GameMods:
				result.GameMods = append(result.GameMods, items...)
			case fditch.Misc:
				result.Misc = append(result.Misc, items...)
			}
		}
	}

	logItems(result)

	// transform items to json
	resultJSON := itchioItemsToJSON(result)

	// resultJSON to a file
	err := ioutil.WriteFile("items.json", []byte(resultJSON), 0644)
	if err != nil {
		panic(err)
	}
}
