(()=>{
    //デザイン・アニメーション・レスポンシブ対応のためのjsファイル
    //今後のスマホ対応に向け設置

    const $doc = document;
    const $tools = $doc.getElementsByClassName('tools');
    const $toolbar = $doc.getElementsByClassName('toolbar')[0];
    // const $index = document.getElementsByClassName('index')
    // let course_show = 0;

    // function less_920(){
    //   $toolbar.style.display = 'none';
    // }

    // function more_920(){
    //   $toolbar.style.display = 'flex';
    // }

    // //最初に1回行う
    // if(window.innerWidth < 920){
    //   less_920();
    // } else {
    //   more_920();
    // }

    //あとはサイズが変わったときのみ判定
    // window.onresize = function () {
    //   if(window.innerWidth < 920){
    //     // less_920();
    //   } else {
    //     more_920();
    //   }
    // }


    // //左側表示・非表示
    // for (let i = 0; i < $index.length; i++) {
    //   $index[i].addEventListener('click', () => {
    //     if (course_show == 0){
    //       document.getElementsByClassName('group')[i].style.display = 'none';
    //       course_show = 1;
    //     }else{
    //       document.getElementsByClassName('group')[i].style.display = 'block';
    //       course_show = 0;
    //     };
    //   }); 
    // };

  })();