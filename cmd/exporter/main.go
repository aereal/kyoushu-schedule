package main

import (
	"context"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
	"os"
	"strconv"

	"golang.org/x/oauth2/google"
	"google.golang.org/api/sheets/v4"
)

func main() {
	if err := run(); err != nil {
		fmt.Printf("! %+v\n", err)
		os.Exit(1)
	}
}

func newAuthenClient(ctx context.Context, keyPath string) (*http.Client, error) {
	b, err := ioutil.ReadFile(keyPath)
	if err != nil {
		return nil, fmt.Errorf("cannot read key file: %w", err)
	}
	jwt, err := google.JWTConfigFromJSON(b, sheets.SpreadsheetsReadonlyScope)
	if err != nil {
		return nil, fmt.Errorf("cannot build config from JSON: %w", err)
	}
	return jwt.Client(ctx), nil
}

func run() error {
	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()

	keyPath := os.Getenv("GOOGLE_SERVICE_ACCOUNT_KEY_PATH")
	if keyPath == "" {
		return fmt.Errorf("GOOGLE_SERVICE_ACCOUNT_KEY_PATH is required")
	}
	spreadsheetID := os.Getenv("SPREADSHEET_ID")
	if spreadsheetID == "" {
		return fmt.Errorf("SPREADSHEET_ID is required")
	}

	httpClient, err := newAuthenClient(ctx, keyPath)
	svc, err := sheets.New(httpClient)
	if err != nil {
		return fmt.Errorf("cannot build sheets API client: %w", err)
	}

	resp, err := svc.Spreadsheets.Values.
		Get(spreadsheetID, "schedule!A1:L100").
		MajorDimension("ROWS").
		DateTimeRenderOption("FORMATTED_STRING").
		ValueRenderOption("FORMATTED_VALUE").
		Context(ctx).Do()
	if err != nil {
		return fmt.Errorf("! Values.Get: %w", err)
	}
	monthlySchedules, err := parseValues(resp.Values)
	if err != nil {
		return err
	}
	f, err := os.OpenFile("./src/schedules.json", os.O_WRONLY|os.O_CREATE, 0666)
	if err != nil {
		return err
	}
	defer f.Close()
	if err := json.NewEncoder(f).Encode(&MonthlySchedules{DailySchedules: monthlySchedules}); err != nil {
		return err
	}
	return nil
}

type MonthlySchedules struct {
	DailySchedules []*DailySchedule
}

type DailySchedule struct {
	Date      string
	Schedules [10]int
}

func (s *DailySchedule) consume(columns []string) error {
	if len(columns) < 12 {
		return fmt.Errorf("invalid columns")
	}
	s.Date = columns[0]
	for i, c := range columns[2 : len(columns)-1] {
		if c == "" {
			continue
		}
		ic, err := strconv.Atoi(c)
		if err != nil {
			return fmt.Errorf("invalid value (index=%d; raw=%q): %w", i, c, err)
		}
		s.Schedules[i] = ic
	}
	return nil
}

func parseValues(rows [][]interface{}) ([]*DailySchedule, error) {
	seenHeader := false
	schedules := []*DailySchedule{}
	var size int
	for _, columns := range rows {
		if !seenHeader {
			size = len(columns)
			seenHeader = true
			continue
		}
		xs := make([]string, size)
		for i, c := range columns {
			xs[i] = c.(string)
		}
		s := &DailySchedule{}
		if err := s.consume(xs); err != nil {
			return nil, err
		}
		schedules = append(schedules, s)
	}
	return schedules, nil
}
