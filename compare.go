package compare

import (
	"os"

	"go.k6.io/k6/js/modules"
)

// init is called by the Go runtime at application startup.
func init() {
	modules.Register("k6/x/diff", new(Diff))
}

// Diff is the type for our custom API.
type Diff struct{}

func (c *Diff) MoveAndRenameFile(oldPath, newPath string) error {
	err := os.Rename(oldPath, newPath)
	if err != nil {
		return err
	}
	return nil
}

func (c *Diff) DeleteFile(path string) error {
	err := os.Remove(path)
	if err != nil {
		return err
	}
	return nil
}

func (c *Diff) CheckIfFileExists(filename string) bool {
	if _, err := os.Stat(filename); err == nil {
		return true
	}
	return false
}

func (c *Diff) CompareVisuals(firstPath, secondPath, outputPath string) float64 {
	percent, err := generateDiff(firstPath, secondPath, outputPath)
	if err != nil {
		panic(err)
	}
	return percent
}

// generateDiff compares the old and new image and returns difference.
// Returns -1.0 when it encounters an error.
func generateDiff(oldImage, newImage, dst string) (float64, error) {
	srcImage, err := loadImage(oldImage)
	if err != nil {
		return -1.0, err
	}
	dstImage, err := loadImage(newImage)
	if err != nil {
		return -1.0, err
	}

	diff, percent, err := CompareImages(srcImage, dstImage)
	if err != nil {
		return -1.0, err
	}

	err = writeImage(dst, diff)
	if err != nil {
		return -1.0, err
	}

	return percent, nil
}
