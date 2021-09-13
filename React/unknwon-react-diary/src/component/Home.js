import React from 'react';
import Button from '@material-ui/core/Button';
import { Link } from 'react-router-dom';
import CreateIcon from '@material-ui/icons/Create';
import MenuBookIcon from '@material-ui/icons/MenuBook';

const Home = () => {
  return (
    <div className="flex justify-center items-center flex-col w-screen pt-8">
      <div className="bg-white text-center shadow-xl py-4 px-8 w-10/12 max-w-2xl rounded-md m-6">
        <p className="text-xl mb-3 text-black font-bold text-gray-600 text-left">
          UnknownDiaryで誰かの人生の1ページを覗いてみよう
        </p>
        <p className="text-left">
          このアプリは、瓶に封じて宛先もなく川や海に漂流させるボトルメールをイメージして作られました。見知らぬ誰かの想い出のあの日を知ることで、他人の人生の1ページを覗いた気分になれます。
        </p>
        <p className="text-left mb-4">
          日記は匿名でランダムに取得ができます。素敵だと思った日記にリアクションをしたり足跡を残すことができます。
        </p>
        <Link to="/diary">
          <Button variant="contained" color="primary">
            <MenuBookIcon className="mr-1 " />
            <p className="font-semibold">日記を見る</p>
          </Button>
        </Link>
      </div>
      <div className="bg-white text-center shadow-xl py-4 px-8 w-10/12 max-w-2xl rounded-md m-6">
        <p className="text-xl mb-3 text-black font-bold text-gray-600 text-left">貴方の人生の1ページを共有しよう</p>
        <p className="text-left">
          貴方の感動した日、人生の転機になった日、失恋した日、思い出の日、または自分の今の感情やポエムをインターネットの海に流してみてください。
        </p>
        <p className="text-left mb-4">貴方が残した日記はプロフィールページで一覧として振り返ることができます。</p>
        <Link to="/post">
          <Button variant="contained" color="primary">
            <CreateIcon className="mr-1 " />
            <p className="font-semibold">日記を書く</p>
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default Home;
