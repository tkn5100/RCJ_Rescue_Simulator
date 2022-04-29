(()=>{
    //デザイン・アニメーション・レスポンシブ対応のためのjsファイル
    const $doc = document;
    const $img = $doc.getElementsByClassName('image');
    const imgLen = $img.length;
    const $tools = $doc.getElementsByClassName('tools');
    const $toolbar = $doc.getElementsByClassName('toolbar')[0];
    // const $index = document.getElementsByClassName('index');
    const $bump_number = document.getElementsByName('radio');
    const $bump_input = document.getElementsByClassName('bump-input');
    const $bump_input_div = document.querySelectorAll('#bump_settings > div');
    const $bump_preview = document.querySelectorAll('#bump_settings > div > .bump');
    // let course_show = 0;
    let numberOfBump = null;
    let bump_data = null;

    //バンプ設定
    //最初は1本設定にする(index=2)
    for (let index = 2; index < $bump_input_div.length - 1; index++){
      $bump_input_div[index].style.display = 'none';
      $bump_preview[index - 1].style.display = 'none';
    }
    for (let index = 0; index < $bump_number.length; index++) {
      $bump_number[index].addEventListener('click',function(){
        //インプットの表示・非表示
        for (let index = 0; index < $bump_number.length; index++) {
          if ($bump_number[index].checked) {
            numberOfBump = Number($bump_number[index].value) + 1;
          }
        }
        //全部隠してから順に表示
        for (let index = 1; index < $bump_input_div.length - 1; index++){
          $bump_input_div[index].style.display = 'none';
          $bump_preview[index - 1].style.display = 'none';
        }
        if (numberOfBump >= 1){
          $bump_input_div[1].style.display = 'flex';
          $bump_preview[0].style.display = 'block';
        }
        if (numberOfBump >= 2){
          $bump_input_div[2].style.display = 'flex';
          $bump_preview[1].style.display = 'block';
        }
        if (numberOfBump >= 3){
          $bump_input_div[3].style.display = 'flex';
          $bump_preview[2].style.display = 'block';
        }
        if (numberOfBump >= 4){
          $bump_input_div[4].style.display = 'flex';
          $bump_preview[3].style.display = 'block';
        }
        numberOfBump = null;
      });
    }

    //プレビューに反映
    function bump_previewFunc(){
      for (let index = 0; index < $bump_input.length; index += 3){
        //左
        if(0 <= $bump_input[index].value && $bump_input[index].value <= 74){
          $bump_input[index].style.border = 'solid 1px #000000';
          if(window.innerWidth < 920){
            $bump_preview[index / 3].style.left = ($bump_input[index].value / 10) + "vw";
          } else {
            $bump_preview[index / 3].style.left = $bump_input[index].value + "px";
          }
        } else {
          $bump_input[index].style.border = 'solid 1px #FF0000';
          $bump_input[index].value = '';
        }
        //上
        if(0 <= $bump_input[index + 1].value && $bump_input[index + 1].value <= 74){
          $bump_input[index + 1].style.border = 'solid 1px #000000';
          if(window.innerWidth < 920){
            $bump_preview[index / 3].style.top = (($bump_input[index + 1].value - 37) / 10) + "vw";
          } else {
            $bump_preview[index / 3].style.top = ($bump_input[index + 1].value - 37) + "px";
          }
        } else {
          $bump_input[index + 1].style.border = 'solid 1px #FF0000';
          $bump_input[index + 1].value = '';
        }
        //回転
        if(-90 <= $bump_input[index + 2].value && $bump_input[index + 2].value <= 90){
          $bump_input[index + 2].style.border = 'solid 1px #000000';
          $bump_preview[index / 3].style.transform = "rotate(" + $bump_input[index + 2].value + "deg)";
        } else {
          $bump_input[index + 2].style.border = 'solid 1px #FF0000';
          $bump_input[index + 2].value = '';
        }
      }
    }
    //初めに一回
    bump_previewFunc();

    for (let index = 0; index < $bump_input.length; index += 1){
      $bump_input[index].addEventListener('change',() => {
        bump_previewFunc();
      });
    }

    function less_920(){
      for (let index = 0; index < imgLen; index++) {
        //バンプ
        if ($img[index].dataset.bump1 != 0) {
          bump_data = $img[index].dataset.bump1.split('a');
          $img[index].parentElement.children[1].style.left = (Number(bump_data[0]) / 10) + "vw";
          $img[index].parentElement.children[1].style.top = (Number(bump_data[1]) / 10) + "vw";
          bump_data = null;
        }
        if ($img[index].dataset.bump2 != 0) {
          bump_data = $img[index].dataset.bump2.split('a');
          $img[index].parentElement.children[2].style.left = (Number(bump_data[0]) / 10) + "vw";
          $img[index].parentElement.children[2].style.top = (Number(bump_data[1]) / 10) + "vw";
          bump_data = null;
        }
        if ($img[index].dataset.bump3 != 0) {
          bump_data = $img[index].dataset.bump3.split('a');
          $img[index].parentElement.children[3].style.left = (Number(bump_data[0]) / 10) + "vw";
          $img[index].parentElement.children[3].style.top = (Number(bump_data[1]) / 10) + "vw";
          bump_data = null;
        }
        if ($img[index].dataset.bump4 != 0) {
          bump_data = $img[index].dataset.bump4.split('a');
          $img[index].parentElement.children[4].style.left = (Number(bump_data[0]) / 10) + "vw";
          $img[index].parentElement.children[4].style.top = (Number(bump_data[1]) / 10) + "vw";
          bump_data = null;
        }
        for (let index = 0; index < $bump_input.length; index += 3){
          $bump_preview[index / 3].style.left = $bump_input[index].value / 10 + "vw";
          $bump_preview[index / 3].style.top = ($bump_input[index + 1].value - 37) / 10 + "vw";
        }
      }
    }

    function more_920(){
      for (let index = 0; index < imgLen; index++) {
        //バンプ
        if ($img[index].dataset.bump1 != 0) {
          bump_data = $img[index].dataset.bump1.split('a');
          $img[index].parentElement.children[1].style.left = bump_data[0] + "px";
          $img[index].parentElement.children[1].style.top = bump_data[1] + "px";
          bump_data = null;
        }
        if ($img[index].dataset.bump2 != 0) {
          bump_data = $img[index].dataset.bump2.split('a');
          $img[index].parentElement.children[2].style.left = bump_data[0] + "px";
          $img[index].parentElement.children[2].style.top = bump_data[1] + "px";
          bump_data = null;
        }
        if ($img[index].dataset.bump3 != 0) {
          bump_data = $img[index].dataset.bump3.split('a');
          $img[index].parentElement.children[3].style.left = bump_data[0] + "px";
          $img[index].parentElement.children[3].style.top = bump_data[1] + "px";
          bump_data = null;
        }
        if ($img[index].dataset.bump4 != 0) {
          bump_data = $img[index].dataset.bump4.split('a');
          $img[index].parentElement.children[4].style.left = bump_data[0] + "px";
          $img[index].parentElement.children[4].style.top = bump_data[1] + "px";
          bump_data = null;
        }
        for (let index = 0; index < $bump_input.length; index += 3){
          $bump_preview[index / 3].style.left = $bump_input[index].value + "px";
          $bump_preview[index / 3].style.top = ($bump_input[index + 1].value - 37) + "px";
        }
      }
    }

    //サイズが変わったときのみ判定
    window.onresize = function () {
      if(window.innerWidth < 920){
        less_920();
      } else {
        more_920();
      }
    }


    // //メニューのインデックス表示・非表示
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