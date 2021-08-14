package util

import (
	"fmt"
	"time"
)

// DateConverter - 文字列の日付をフォーマットする関数
func DateConverter(date *string) *string {
	fmt.Printf("date %v %T\n", *date, *date)
	// 一旦time.Time型へ変換
	dateTime, err := time.Parse("2006-01-02", *date)
	fmt.Printf("time型 %v %T\n", dateTime, dateTime)
	if err != nil {
		dateString := dateTime.Format("2006/1/2")
		fmt.Printf("特定のformatoへ %v %T\n", dateString, dateString)
		return &dateString
	}
	dateString := dateTime.Format("2006/1/2")
	fmt.Printf("特定のformatoへ2 %v %T\n", dateString, dateString)
	return &dateString
}
