// Package game is a data model for a game
package game

type Game struct {
	title                string
	completed            bool
	description          string
	completionPercentage int
	platform             string
	trophyHunting        bool
}
