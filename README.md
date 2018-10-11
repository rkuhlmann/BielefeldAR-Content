# BielefeldAR-Content

In 'scr' liegen alle Dateien für die einzelnen Touren

In 'dist' die dazugehörigen zip Dateien

# Wichtige Dateien und Ordner
## src-Ordner
* Jede Tour hat einen Ordner (1=Kunst und Kultur Tour ; 2=Kneipentour ; 3=Arminatour)
* im Tour Ordner ist nur der Pois-Ordner wichtig (im baseAugmention Order muss nichts verändert werden)

## Pois-Ordner
Jede Tour-Station hat einen Ordner (1=Kunsthalle 2=Kusthallenpark usw.)

## Stations-Ordner (1, 2, 3 usw.)
Hier werden alle Bilder und Audio-Dateien zu der Station gespeichert; evtl. müssen zusätzlich die Dateipfade in den einzelen JSON-Dateien geändert werden (galery.json, audio.json usw.)

## allPois.json (liegt im Pois-Ordner)
Hier werden alle Tour-Stationen definiert
Ein ein Tour-Station ist wie folgt aufgebaut:
```	
  {
		"name" : "Kunsthalle",
		"description" : "Die bielefelder Kunsthalle....",
		"locationMapLat" : 52.018153,
		"locationMapLong" : 8.525960,
		"thumbnail" : "1/Pois/1/thumbnail.png",
		"markerImage" : "1/Pois/1/markerImage.png",
		"markerIds" : [
			"marker1"
		],
		"contents" : [
			{
				"name" : "Sprecher",
				"contentType" : "AUDIO",
				"mediaPath" : "1/Pois/1/audio.json"
			},
			{
				"name" : "Beschreibungstext",
				"contentType" : "TEXT",
				"mediaPath" : "1/Pois/1/description.json"
			},
			{
				"name" : "Galery",
				"contentType" : "GALERY",
				"mediaPath" : "1/Pois/1/galery/galery.json"
			}
		]
  },
  ```
