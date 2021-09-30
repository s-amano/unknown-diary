import React, { memo } from 'react';
import { Grid } from '@material-ui/core';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import DateFnsUtils from '@date-io/date-fns';
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';

export default memo(function DiaryForm(props) {
  const { inputDiary, handleInputChange, updateDiaryDate, isDateValid, survayPost, inputDiaryDate, postWord } = props;
  return (
    <>
      <TextField
        name="title"
        style={{ width: '100%' }}
        label="日記のタイトル"
        variant="filled"
        helperText="30字以下で入力してください"
        error={Boolean(inputDiary.title.length !== 0 && !(inputDiary.title.length <= 30))}
        value={inputDiary.title}
        onChange={handleInputChange()}
      />
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <Grid
          container
          justifyContent="flex-start"
          style={{ justifyContent: 'flex-start', marginLeft: '1%', marginBottom: '16px' }}
        >
          <KeyboardDatePicker
            margin="normal"
            id="date-picker-dialog"
            // label="日付"
            format="yyyy/MM/dd"
            value={inputDiaryDate}
            onChange={updateDiaryDate()}
            KeyboardButtonProps={{
              'aria-label': 'change date',
            }}
            error={Boolean(!isDateValid)}
            helperText="有効な形式で日付を入力してください"
          />
        </Grid>
      </MuiPickersUtilsProvider>
      <TextField
        name="content"
        style={{ width: '100%', marginBottom: '5%' }}
        label="日記の内容"
        multiline
        rows={15}
        value={inputDiary.content}
        onChange={handleInputChange()}
        // postする文字数が17文字未満(初期値は除く),5000文字以上の場合はエラー文表示
        error={Boolean(
          inputDiary.content.length !== 0 && !(17 <= inputDiary.content.length && inputDiary.title.length < 5000)
        )}
        helperText="17文字以上5000字以下で入力してください"
        variant="filled"
      />

      <Grid container justify="flex-start">
        <Button
          variant="contained"
          color="primary"
          onClick={() => survayPost()}
          disabled={Boolean(
            !(
              17 <= inputDiary.content.length &&
              inputDiary.content.length < 5000 &&
              inputDiary.title.length <= 30 &&
              isDateValid
            )
          )}
        >
          <p style={{ color: 'white', fontWeight: 'bold', margin: '3px' }}>{postWord}</p>
        </Button>
      </Grid>
    </>
  );
});
