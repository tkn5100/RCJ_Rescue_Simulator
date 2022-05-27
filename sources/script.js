(()=>{
    //メインプログラムのためのjsファイル
    const $doc = document;
    const $guide = $doc.getElementById('guidetext');
    const $img = $doc.getElementsByClassName('image');
    const $course_nrl = $doc.getElementsByClassName('menu-img-n');
    const $course_wrl = $doc.getElementsByClassName('menu-img-w');
    const imgLen = $img.length;
    const courseNrlLen = $course_nrl.length;
    const courseWrlLen = $course_wrl.length;
    const $tools = $doc.getElementsByClassName('tools');
    const $start_tools = $doc.getElementsByClassName('start_tools');
    const $radio_league = $doc.getElementsByName('league');
    const $radio_league2 = $doc.getElementsByName('league2')
    const $table = $doc.getElementsByTagName('table');
    // const $index = document.getElementsByClassName('index')
    const $coursedata = $doc.getElementsByClassName('coursedata');
    const $bump_input = document.getElementsByClassName('bump-input');
    const $bump_input_div = document.querySelectorAll('#bump_settings > div');
    const $contextmenu_title = document.getElementsByTagName('li');
    const $contextmenu = document.getElementById('contextmenu');
    let nowturn = null;
    let src = null;
    let checkOrUncheck = null;
    let newCheckMarker = null;
    let obOrUnob = null;
    let newObstacle = null;
    let bumpOrUnbump = null;
    let newBump = null;
    let output_data = [[],[],[],[],[],[],[],[],[],[],[]];
    let csv_arrays = null;
    let input_data_show = null;
    let input_data_course = [];
    let input_data_turn = [];
    let input_data_border = [];
    let input_data_check = [];
    let input_data_obstacle = [];
    let input_data_bump1 = [];
    let input_data_bump2 = [];
    let input_data_bump3 = [];
    let input_data_bump4 = [];
    let bump_data = null;
    let file = null;
    // let course_show = 0;
    let data = null;
    let auto_save_tile = [];
    let auto_save_turn = [];
    let auto_save_input_tile = [];
    let auto_save_input_turn = [];
    let first_floor = [];
    let second_floor = [];

    const agent = window.navigator.userAgent.toLowerCase();
    let what_browser = null;

    if (agent.indexOf('msie') != -1 || agent.indexOf('trident') != -1) {
      window.alert('このブラウザではアプリケーションが正しく動作しません。')
    } else if (agent.indexOf('edg') != -1) {
      what_browser = 'Edge';
    } else if (agent.indexOf('edge') != -1) {
      window.alert('このブラウザではアプリケーションが正しく動作しません。')
    } else if (agent.indexOf('opr') != -1) {
      what_browser = 'Opera';
    } else if (agent.indexOf('opera') != -1) {
      window.alert('このブラウザではアプリケーションが正しく動作しません。')
    } else if (agent.indexOf('chrome') != -1) {
      what_browser = 'Chrome';
    } else if (agent.indexOf('safari') != -1) {
      what_browser = 'Safari';
      document.getElementById('input_file').accept=".rrl, .csv"
    } else if (agent.indexOf('firefox') != -1) {
      what_browser = 'FireFox';
    }

    function nomal_guide() {
      if(document.getElementById('nrl-tiles').style.display == 'block'){
        $guide.textContent = 'タイルをダブルクリックすると時計回りに90度回転します';
      } else {
        if($tools[1].dataset.one == 1){
          $guide.textContent = 'ただいま1階部分を作成中です。2階部分があると柱が表示されます。';
        }else{
          $guide.textContent = 'ただいま2階・半2階部分を作成中です。1階はタイルのみ灰色で表示されています。';
        }
      }
    };

    function auto_save(){
      for (let index = 0; index < imgLen; index++) {
        auto_save_tile.push("../img/simulator/" + $img[index].src.slice(-6));
        auto_save_turn.push($img[index].dataset.turn);
      }
      if (localStorage.hasOwnProperty("rrl_auto-save_tile")){
        localStorage.removeItem("rrl_auto-save_tile");
      }
      if (localStorage.hasOwnProperty("rrl_auto-save_turn")){
        localStorage.removeItem("rrl_auto-save_turn");
      }
      if (localStorage.hasOwnProperty("rrl_auto-save_league")){
        localStorage.removeItem("rrl_auto-save_league");
      }
      if (document.getElementById('nrl-tiles').style.display == "block"){
        localStorage.setItem("rrl_auto-save_league", "nrl");
      } else {
        localStorage.setItem("rrl_auto-save_league", "wrl");
      }
      localStorage.setItem("rrl_auto-save_tile", JSON.stringify(auto_save_tile));
      localStorage.setItem("rrl_auto-save_turn", JSON.stringify(auto_save_turn));
      auto_save_tile = [];
      auto_save_turn = [];
    }


    //回転
    function turn() {
      for (let index = 0; index < imgLen; index++) {
        nowturn = null; 
        $img[index].addEventListener('dblclick', (e)=> {
          nowturn = Number(e.target.dataset.turn);
          e.target.style.transform = 'rotate(' + (90 + nowturn) +'deg)';
          e.target.dataset.turn = 90 + nowturn;
        });
      }
    }
    turn();


    // 本プログラム
    function course_input() {
      for (let index = 1; index < courseNrlLen; index++) {
        $course_nrl[index].addEventListener('click', (e)=> {
          //被災者自動入力の無効化
          $img[0].onclick = function () {};
          $img[4].onclick = function () {};
          $img[24].onclick = function () {};
          $img[28].onclick = function () {};
          nomal_guide();
          src = e.target.src;
          for (let index = 0; index < imgLen; index++) {
            $img[index].addEventListener('click', (e)=> {
              e.target.src = src;
              e.target.style.backgroundColor = "#FFFFFF";
              auto_save();
            });
          }
        });
      }
      for (let index = 1; index < courseWrlLen; index++) {
        $course_wrl[index].addEventListener('click', (e)=> {
          //被災者自動入力の無効化
          $img[0].onclick = function () {};
          $img[4].onclick = function () {};
          $img[24].onclick = function () {};
          $img[28].onclick = function () {};
          nomal_guide();
          src = e.target.src;
          for (let index = 0; index < imgLen; index++) {
            $img[index].addEventListener('click', (e)=> {
              e.target.src = src;
              e.target.style.backgroundColor = "#FFFFFF";
              auto_save();
            });
          }
        });
      }
    }
    course_input();

    //タイル情報
    data = 'none';
    function course_data() {
      for (let index = 0; index < $coursedata.length; index++) {
        $coursedata[index].addEventListener('click', (e) => {
          data = e.target.style.border
        });
      }
      for (let i = 0; i < imgLen; i++) {
        $img[i].addEventListener('click', (e)=> {
          e.target.style.border = data;
        });
      }
    }
    course_data();

    // 被災者ゾーンの自動入力
    const corner = '../img/simulator/r1.png';
    const wall = '../img/simulator/r2.png';
    const white = '../img/simulator/wt.png';
    let a = 0;
    function hisaisya(arg) {
      if (a === 0){
        $img[arg].src = corner;
        $img[arg + 1].src = wall;
        $img[arg + 2].src = wall;
        $img[arg + 3].src = corner;
        $img[arg + 3].style.transform = 'rotate(90deg)';
        $img[arg + 3].dataset.turn = 90;
        $img[arg + 8].src = wall;
        $img[arg + 8].style.transform = 'rotate(270deg)';
        $img[arg + 8].dataset.turn = 270;
        $img[arg + 9].src = white;
        $img[arg + 10].src = white;
        $img[arg + 11].src = wall;
        $img[arg + 11].style.transform = 'rotate(90deg)';
        $img[arg + 11].dataset.turn = 90;
        $img[arg + 16].src = corner;
        $img[arg + 16].style.transform = 'rotate(270deg)';
        $img[arg + 16].dataset.turn = 270;
        $img[arg + 17].src = wall;
        $img[arg + 17].style.transform = 'rotate(180deg)';
        $img[arg + 17].dataset.turn = 180;
        $img[arg + 18].src = wall;
        $img[arg + 18].style.transform = 'rotate(180deg)';
        $img[arg + 18].dataset.turn = 180;
        $img[arg + 19].src = corner;
        $img[arg + 19].style.transform = 'rotate(180deg)';
        $img[arg + 19].dataset.turn = 180;
        a = 1
        auto_save();
        nomal_guide();
      } else if (src != '../img/simulator/r1.png'){} else{
        window.alert('コートに避難ゾーンは一つしか置けません。');
      }
    };
    
    $course_nrl[0].addEventListener('click', ()=>{
      //もしほかのタイルをクリックした後にこれを実行した時用
      src = '../img/simulator/r1.png';
      $guide.textContent = 'このタイルを一番左上、その3つ下、それらの3つ右のどこかに置くと被災者ゾーンを自動入力します';
      $img[0].onclick = function () {
        hisaisya(0);
      };
      $img[4].onclick = function () {
        hisaisya(4);
      };
      $img[24].onclick = function () {
        hisaisya(24);
      };
      $img[28].onclick = function () {
        hisaisya(28);
      };
    });
    $course_wrl[0].addEventListener('click', ()=>{
      //もしほかのタイルをクリックした後にこれを実行した時用
      src = '../img/simulator/r1.png';
      $guide.textContent = 'このタイルを一番左上、その3つ下、それらの3つ右のどこかに置くと被災者ゾーンを自動入力します';
      $img[0].onclick = function () {
        hisaisya(0);
      };
      $img[4].onclick = function () {
        hisaisya(4);
      };
      $img[24].onclick = function () {
        hisaisya(24);
      };
      $img[28].onclick = function () {
        hisaisya(28);
      };
    });


    //スタート画面に戻る
    $tools[0].addEventListener('click', () => {
      document.getElementById('overlay').className = "active";
      document.getElementById('start').className = "active";
      $start_tools[3].style.display = 'block';
    });

    let index2 = 0;
    function tile(arg) {
      arg = Number(arg);
      $table[0].style.display = 'none';
      $table[1].style.display = 'none';
      $table[2].style.display = 'none';
      $table[3].style.display = 'none';
      $table[4].style.display = 'none';
      $table[5].style.display = 'none';
      $table[arg].style.display = 'block';
      if(arg == 1 || arg== 3 || arg == 5){
        for (let index = 0; index < $table[arg - 1].firstElementChild.children.length; index++){
          for (let i = 0; i < $table[arg - 1].firstElementChild.children[index].children.length; i++){
            first_floor.push(["../img/simulator/" + $table[arg - 1].firstElementChild.children[index].children[i].firstElementChild.src.slice(-6), $table[arg - 1].firstElementChild.children[index].children[i].firstElementChild.dataset.turn])
          }
        }
        for (let index = 0; index < $table[arg].firstElementChild.children.length; index++){
          for (let i = 0; i < $table[arg].firstElementChild.children[index].children.length; i++){
            if ($table[arg].firstElementChild.children[index].children[i].firstElementChild.style.backgroundColor != 'rgb(255, 255, 255)' || $table[arg].firstElementChild.children[index].children[i].firstElementChild.src.slice(-6) == 'no.png'){
              $table[arg].firstElementChild.children[index].children[i].firstElementChild.src = first_floor[index2][0];
              $table[arg].firstElementChild.children[index].children[i].firstElementChild.style.transform = "rotate(" + first_floor[index2][1] + "deg)";
              $table[arg].firstElementChild.children[index].children[i].firstElementChild.style.backgroundColor = "#DDDDDD";
            }
            index2++;
          }
        }
      } else if ($tools[1].style.display == 'none'){
        //何もしない
      } else {
        for (let index = 0; index < imgLen; index++) {
          $img[index].style.backgroundImage = "none";
        }
        for (let index = 0; index < $table[arg + 1].firstElementChild.children.length; index++){
          for (let i = 0; i < $table[arg + 1].firstElementChild.children[index].children.length; i++){
            if($table[arg + 1].firstElementChild.children[index].children[i].firstElementChild.style.backgroundColor == 'rgb(255, 255, 255)'){
              second_floor.push(1);
            } else {
              second_floor.push(0);
            }
          }
        }
        for (let index = 0; index < $table[arg].firstElementChild.children.length; index++){
          for (let i = 0; i < $table[arg].firstElementChild.children[index].children.length; i++){
            if(second_floor[index2] == 1){
              $table[arg].firstElementChild.children[index].children[i].firstElementChild.style.backgroundImage = "url(../img/simulator/po.png)";
              $table[arg].firstElementChild.children[index].children[i].firstElementChild.style.backgroundSize = "100%";
            }
            index2++;
          }
        }
      }
      first_floor = [];
      second_floor = [];
      index2 = 0;
    }

    //2階・半2階
    $tools[1].addEventListener('click', () => {
      if($tools[1].dataset.one == 1){
        if($table[0].style.display == 'block'){
          tile(1);
        }else if ($table[2].style.display == 'block'){
          tile(3);
        }else if($table[4].style.display == 'block'){
          tile(5);
        }
        $coursedata[0].style.display = 'none';
        $coursedata[1].style.display = 'none';
        $coursedata[2].style.display = 'block';
        $coursedata[3].style.display = 'block';
        $coursedata[4].style.display = 'block';
        data = 'solid 1px #FF3366';
        $tools[1].src = '../img/tools/floor1.svg';
        $tools[1].nextElementSibling.textContent = '1階部分の作成';
        $tools[1].dataset.one = 2;
        nomal_guide();
      }else{
        if($table[1].style.display == 'block'){
          tile(0);
        }else if ($table[3].style.display == 'block'){
          tile(2);
        }else if($table[5].style.display == 'block'){
          tile(4);
        }
        $coursedata[0].style.display = 'block';
        $coursedata[1].style.display = 'block';
        $coursedata[2].style.display = 'none';
        $coursedata[3].style.display = 'none';
        $coursedata[4].style.display = 'none';
        data = 'none';
        $tools[1].src = '../img/tools/floor2.svg';
        $tools[1].nextElementSibling.textContent = '2階・半2階部分の作成';
        $tools[1].dataset.one = 1;
        nomal_guide();
      }
    });

    //グリッドの表示・非表示
    $tools[2].addEventListener('click', () => {
      if($tools[2].dataset.grid == 1){
        //tdとimgの数は一緒
        for (let index = 0; index < imgLen; index++) {
          $doc.getElementsByTagName('td')[index].style.border = 'none';
        }
        $tools[2].nextElementSibling.textContent = 'グリッドの非表示';
        $tools[2].dataset.grid = 0;
        $guide.textContent = 'グリッドを非表示にしました';
        setTimeout(nomal_guide, 2000);
      }else{
        for (let index = 0; index < imgLen; index++) {
          $doc.getElementsByTagName('td')[index].style.border = '1px solid #AAAAAA';
        }
        $tools[2].nextElementSibling.textContent = 'グリッドの表示';
        $tools[2].dataset.grid = 1;
        $guide.textContent = 'グリッドを表示しています';
        setTimeout(nomal_guide, 2000);
      }
    });

    //プロジェクトの保存
    function downloadCSV() {
      output_data = [[],[],[],[],[],[],[],[],[],[],[]];
      //ダウンロードするCSVファイル名を指定する
      const filename = window.prompt('ファイル名を入力:');
      if (filename) {
        //ダウンロードするタイルを配列に入れる
        output_data[0].push("v4.4.2");
        //どのコートを編集しいたか
        if($table[0].style.display == 'block'){
          output_data[1].push("0");
        } else if ($table[1].style.display == 'block'){
          output_data[1].push("1");
        } else if ($table[2].style.display == 'block'){
          output_data[1].push("2");
        } else if ($table[3].style.display == 'block'){
          output_data[1].push("3");
        } else if ($table[4].style.display == 'block'){
          output_data[1].push("4");
        } else if ($table[5].style.display == 'block'){
          output_data[1].push("5");
        }
        //NRLモードかWRLモードか
        if(document.getElementById('nrl-tiles').style.display == 'block'){
          output_data[1].push("nrl");
        } else {
          output_data[1].push("wrl");
        }
        //以下タイル
        for (let index = 0; index < imgLen; index++) {
          console.log($img[index].style.backgroundColor)
          if ($img[index].style.backgroundColor == "rgb(221, 221, 221)"){
            output_data[2].push("../img/simulator/no.png");
          } else {
            output_data[2].push("../img/simulator/" + $img[index].src.slice(-6));
          }
          output_data[3].push($img[index].dataset.turn);
          if ($img[index].style.border == "1px solid rgb(102, 51, 102)"){
            output_data[4].push("solid 1px #663366");
          }else if ($img[index].style.border == "1px solid rgb(153, 51, 102)"){
            output_data[4].push("solid 1px #993366");
          }else if ($img[index].style.border == "1px solid rgb(204, 51, 102)"){
            output_data[4].push("solid 1px #CC3366");
          }else if ($img[index].style.border == "1px solid rgb(255, 51, 102)"){
            output_data[4].push("solid 1px #FF3366");
          }else{
            output_data[4].push("none");
          }
          output_data[5].push($img[index].dataset.check);
          output_data[6].push($img[index].dataset.obstacle);
          output_data[7].push($img[index].dataset.bump1);
          output_data[8].push($img[index].dataset.bump2);
          output_data[9].push($img[index].dataset.bump3);
          output_data[10].push($img[index].dataset.bump4);
        };
        output_data[0].push('\n');
        output_data[1].push('\n');
        output_data[2].push('\n');
        output_data[3].push('\n');
        output_data[4].push('\n');
        output_data[5].push('\n');
        output_data[6].push('\n');
        output_data[7].push('\n');
        output_data[8].push('\n');
        output_data[9].push('\n');
        //BOMを付与する（Excelでの文字化け対策）
        const bom = new Uint8Array([0xef, 0xbb, 0xbf]);
        //Blobでデータを作成する
        const blob = new Blob([bom, output_data], { type: "text/csv" });
        //BlobからオブジェクトURLを作成する
        const url = (window.URL || window.webkitURL).createObjectURL(blob);
        //ダウンロード用にリンクを作成する
        const download = document.createElement("a");
        //リンク先に上記で生成したURLを指定する
        download.href = url;
        //download属性にファイル名を指定する
        if(what_browser == 'Safari'){
          download.download = filename + '.csv';
        } else {
          download.download = filename + '.rrl';
        }
        //作成したリンクをクリックしてダウンロードを実行する
        download.click();
        //createObjectURLで作成したオブジェクトURLを開放する
        (window.URL || window.webkitURL).revokeObjectURL(url);
        $guide.textContent = 'プロジェクトを保存しました';
        setTimeout(nomal_guide, 2000);
      }
    }
    $tools[3].addEventListener('click', downloadCSV, false);


    //新規作成
    $start_tools[0].addEventListener('click', () => {
      document.getElementById('overlay').className = "";
      document.getElementById('start').className = "";
      all_clear();
      for (let index = 0; index < $radio_league.length; index++) {
        if ($radio_league[index].checked) {
          if(index == 0){
            document.getElementById('wrl-tiles').style.display = 'none';
            document.getElementById('nrl-tiles').style.display = 'block';
            $tools[1].style.display = 'none';
          } else {
            document.getElementById('wrl-tiles').style.display = 'block';
            document.getElementById('nrl-tiles').style.display = 'none';
            $tools[1].style.display = 'block';
          }
        }
      }
    });


    //プロジェクトの読み込み
    function import_project() {
      for (let index = 0; index < imgLen; index++) {
        //NRL・WRL
        if(input_data_show[2] == 'nrl'){
          document.getElementById('wrl-tiles').style.display = 'none';
          document.getElementById('nrl-tiles').style.display = 'block';
          $tools[1].style.display = 'none';
        } else {
          document.getElementById('wrl-tiles').style.display = 'block';
          document.getElementById('nrl-tiles').style.display = 'none';
          $tools[1].style.display = 'block';
          //コート
          tile(input_data_show[1]);
          if (input_data_show[1] == 1 || input_data_show[1] == 3 || input_data_show[1] == 5){
            $coursedata[0].style.display = 'none';
            $coursedata[1].style.display = 'none';
            $coursedata[2].style.display = 'block';
            $coursedata[3].style.display = 'block';
            $coursedata[4].style.display = 'block';
            $tools[1].src = '../img/tools/floor1.svg';
            $tools[1].nextElementSibling.textContent = '1階部分の作成';
            $tools[1].dataset.one = 2;
            nomal_guide();
          }
        }
        //タイル
        $img[index].src = input_data_course[index + 1];
        if(input_data_course[index + 1] != '../img/simulator/no.png'){
          $img[index].style.backgroundColor = '#FFFFFF';
        }
        $img[index].dataset.turn = input_data_turn[index + 1];
        $img[index].style.transform = 'rotate(' + input_data_turn[index + 1] + 'deg)';
        $img[index].style.border = input_data_border[index + 1];
        //チェックマーカー
        if(input_data_check[index + 1] == 1){
          newCheckMarker = document.createElement("div");
          newCheckMarker.className = "check-marker";
          $img[index].parentElement.appendChild(newCheckMarker);
          $img[index].dataset.check = 1;
        }
        //障害物
        if(input_data_obstacle[index + 1] == 1){
          newObstacle = document.createElement("img");
          newObstacle.src = "../img/simulator/ob.svg";
          newObstacle.className = "obstacle";
          $img[index].parentElement.appendChild(newObstacle);
          $img[index].dataset.obstacle = 1;
        }
        //バンプ
        if(input_data_bump1[index + 1] != 0){
          newBump = document.createElement("img");
          newBump.src = "../img/simulator/bu.png";
          newBump.className = "bump";
          bump_data = input_data_bump1[index + 1].split('a');
          newBump.setAttribute("style", "left: " + bump_data[0] + "px; top: " + bump_data[1] + "px; transform: rotate(" + bump_data[2] + "deg)");
          $img[index].parentElement.appendChild(newBump);
          $img[index].dataset.bump1 = input_data_bump1[index + 1];
          bump_data = null;
          newBump = null;
        }
        if(input_data_bump2[index + 1] != 0){
          newBump = document.createElement("img");
          newBump.src = "../img/simulator/bu.png";
          newBump.className = "bump";
          bump_data = input_data_bump2[index + 1].split('a');
          newBump.setAttribute("style", "left: " + bump_data[0] + "px; top: " + bump_data[1] + "px; transform: rotate(" + bump_data[2] + "deg)");
          $img[index].parentElement.appendChild(newBump);
          $img[index].dataset.bump2 = input_data_bump2[index + 1];
          bump_data = null;
          newBump = null;
        }
        if(input_data_bump3[index + 1] != 0){
          newBump = document.createElement("img");
          newBump.src = "../img/simulator/bu.png";
          newBump.className = "bump";
          bump_data = input_data_bump3[index + 1].split('a');
          newBump.setAttribute("style", "left: " + bump_data[0] + "px; top: " + bump_data[1] + "px; transform: rotate(" + bump_data[2] + "deg)");
          $img[index].parentElement.appendChild(newBump);
          $img[index].dataset.bump3 = input_data_bump3[index + 1];
          bump_data = null;
          newBump = null;
        }
        if(input_data_bump4[index + 1] != 0){
          newBump = document.createElement("img");
          newBump.src = "../img/simulator/bu.png";
          newBump.className = "bump";
          bump_data = input_data_bump4[index + 1].split('a');
          newBump.setAttribute("style", "left: " + bump_data[0] + "px; top: " + bump_data[1] + "px; transform: rotate(" + bump_data[2] + "deg)");
          $img[index].parentElement.appendChild(newBump);
          $img[index].dataset.bump4 = input_data_bump4[index + 1];
          bump_data = null;
          newBump = null;
        }
      };
      if(window.innerWidth < 920){
        for (let index = 0; index < imgLen; index++) {
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
        }
      }
      document.getElementById('input_file').value = '';
      $guide.textContent = 'プロジェクトを読み込みました';
      setTimeout(nomal_guide, 2000);
    }

    let reader = new FileReader();
    document.getElementById('input_file').addEventListener('change', () => {
      if (document.getElementById('input_file').files[0].name.slice(-3) === 'rrl' || document.getElementById('input_file').files[0].name.slice(-3) === 'csv') {
        document.getElementById('overlay').className = "";
        document.getElementById('start').className = "";
        file = document.getElementById('input_file').files[0];
        reader.readAsText(file);
        reader.onload = function () {
          csv_arrays = reader.result.split('\n');
          if (csv_arrays[0] == "v4.0.0," || csv_arrays[0] == "v4.1.0," || csv_arrays[0] == "v4.1.1," || csv_arrays[0] == "v4.2.0," || csv_arrays[0] == "v4.2.1," || csv_arrays[0] == "v4.2.2," || csv_arrays[0] == "v4.3.0," || csv_arrays[0] == "v4.3.1," || csv_arrays[0] == "v4.4.0," || csv_arrays[0] == "v4.4.1," || csv_arrays[0] == "v4.4.2,") {
            if (csv_arrays[0] == "v4.3.0," || csv_arrays[0] == "v4.3.1,") {
              window.alert('v4.3.0とv4.3.1で作成したファイルは、2階部分がうまく保存されていません。')
            }
            try{
              input_data_show = csv_arrays[1].split(',');
              input_data_course = csv_arrays[2].split(',');
              input_data_turn = csv_arrays[3].split(',');
              input_data_border = csv_arrays[4].split(',');
              input_data_check = csv_arrays[5].split(',');
              input_data_obstacle = csv_arrays[6].split(',');
              input_data_bump1 = csv_arrays[7].split(',');
              input_data_bump2 = csv_arrays[8].split(',');
              input_data_bump3 = csv_arrays[9].split(',');
              input_data_bump4 = csv_arrays[10].split(',');
            }catch (e){
              window.alert('エラー:データの読み込みに失敗しました。ファイルが破損している可能性があります。ページを再読み込みします。')
              window.location.reload();
            }
            all_clear();
            import_project();
          } else if (csv_arrays[0] == "v3.0.0," || csv_arrays[0] == "v3.0.1," || csv_arrays[0] == "v3.1.0," || csv_arrays[0] == "v3.1.1,") {
            try{
              input_data_show = csv_arrays[1].split(',');
              input_data_course = csv_arrays[2].split(',');
              input_data_turn = csv_arrays[3].split(',');
              input_data_border = csv_arrays[4].split(',');
              input_data_check = csv_arrays[5].split(',');
              input_data_obstacle = csv_arrays[6].split(',');
              input_data_bump1 = csv_arrays[7].split(',');
              input_data_bump2 = csv_arrays[8].split(',');
              input_data_bump3 = csv_arrays[9].split(',');
              input_data_bump4 = csv_arrays[10].split(',');
            }catch (e){
              window.alert('エラー:データの読み込みに失敗しました。ファイルが破損している可能性があります。ページを再読み込みします。')
              window.location.reload();
            }
            input_data_show.pop();
            for (let index = 0; index < input_data_course.length; index++){
              input_data_course[index] = '../img/simulator/' + input_data_course[index].slice(-6);
            }
            window.alert('このファイルはv3.x.xで作成されたものです。もう1度プロジェクトを保存すると最新版相当になります。')
            document.getElementById('overlay').className = "active";
            document.getElementById('league').className = "active";
            document.getElementById('league_decide').onclick = function () {
              if ($radio_league2[0].checked) {
                input_data_show.push('nrl');
                document.getElementById('overlay').className = "";
                document.getElementById('league').className = "";
                all_clear();
                import_project();
              } else {
                input_data_show.push('wrl');
                document.getElementById('overlay').className = "";
                document.getElementById('league').className = "";
                all_clear();
                import_project();
              }
            }
          } else {
            window.alert('このファイルはメジャーバージョン2以前のソフトウェアによって作成されたものです。最新版に変換してから利用してください。ページを再読み込みします。')
            window.location.reload();
          }
        }
      }else{
        window.alert('拡張子は.rrlしか対応していません。')
      }
    });

    //自動保存の読み込み
    $start_tools[2].addEventListener('click', ()=> {
      if(window.confirm('このデータにはタイルのみが含まれます。詳しくはヘルプをご参照ください。')){
        document.getElementById('overlay').className = "";
        document.getElementById('start').className = "";
        auto_save_input_tile = localStorage.getItem("rrl_auto-save_tile");
        auto_save_input_turn = localStorage.getItem("rrl_auto-save_turn");
        if (auto_save_input_tile == null){
          window.alert('自動保存データがありません')
        }else{
          auto_save_input_tile = JSON.parse(auto_save_input_tile);
          auto_save_input_turn = JSON.parse(auto_save_input_turn);
          for (let index = 0; index < imgLen; index++) {
            $img[index].src = auto_save_input_tile[index];
            $img[index].dataset.turn = auto_save_input_turn[index];
            $img[index].style.transform = 'rotate(' + auto_save_input_turn[index] + 'deg)';
          }
          if(localStorage.getItem("rrl_auto-save_league") == 'nrl'){
            document.getElementById('wrl-tiles').style.display = 'none';
            document.getElementById('nrl-tiles').style.display = 'block';
            $tools[1].style.display = 'none';
          } else {
            document.getElementById('wrl-tiles').style.display = 'block';
            document.getElementById('nrl-tiles').style.display = 'none';
            $tools[1].style.display = 'block';
          }
        }
      }
    });

    //再開
    $start_tools[3].addEventListener('click', () => {
      document.getElementById('overlay').className = "";
      document.getElementById('start').className = "";
    });

    //プリント
    function print() {
      $tools[4].addEventListener('click', ()=> {
        window.alert('PDFとして印刷するにはプリンターを「PDFとして保存」にしてください。印刷するときはレイアウトを「横」にしてください。');
        if($table[0].style.display == 'block'){
          $table[1].style.display = 'block';
          print_block = 0;
        }else if ($table[1].style.display == 'block'){
          $table[0].style.display = 'block';
          print_block = 1;
        }else if ($table[2].style.display == 'block'){
          $table[3].style.display = 'block';
          print_block = 2;
        }else if ($table[3].style.display == 'block'){
          $table[2].style.display = 'block';
          print_block = 3;
        }else if ($table[4].style.display == 'block'){
          $table[5].style.display = 'block';
          print_block = 4;
        }else if($table[5].style.display == 'block'){
          $table[4].style.display = 'block';
          print_block = 5;
        }
        window.print();
        if(print_block = 0){
          $table[1].style.display = 'none';
        }else if(print_block = 1){
          $table[0].style.display = 'none';
        }else if(print_block = 2){
          $table[3].style.display = 'none';
        }else if(print_block = 3){
          $table[2].style.display = 'none';
        }else if(print_block = 4){
          $table[5].style.display = 'none';
        }else if(print_block = 5){
          $table[4].style.display = 'none';
        }
      });
    }
    print();    


    //オールクリア
    function all_clear(){
      for (let index = 0; index < imgLen; index++) {
        $img[index].src = '../img/simulator/no.png';
        $img[index].style = '';
        if($img[index].dataset.check == 1){
          $img[index].nextElementSibling.remove();
          $img[index].dataset.check = 0;
        }else if ($img[index].dataset.obstacle == 1){
          $img[index].nextElementSibling.remove();
          $img[index].dataset.obstacle = 0;
        }else if ($img[index].dataset.bump1 != 0){
          $img[index].nextElementSibling.remove();
          $img[index].dataset.bump1 = 0;
          if ($img[index].dataset.bump2 != 0){
            $img[index].nextElementSibling.remove();
            $img[index].dataset.bump2 = 0;
          }
          if ($img[index].dataset.bump3 != 0){
            $img[index].nextElementSibling.remove();
            $img[index].dataset.bump3 = 0;
          }
          if ($img[index].dataset.bump4 != 0){
            $img[index].nextElementSibling.remove();
            $img[index].dataset.bump4 = 0;
          }
        }
      }
      $img[0].onclick = "";
      $img[4].onclick = "";
      $img[24].onclick = "";
      $img[28].onclick = "";
      a = 0;
    }
    $tools[5].addEventListener('click', ()=> {
      if(window.confirm('すべてのコースデータを削除しますか?この作業は取り消しできません。')){
        all_clear();
        $guide.textContent = 'すべてのコースデータを削除しました';
        setTimeout(nomal_guide, 2000);
      }
    });

    //6×8タイル
    $tools[6].addEventListener('click', ()=> {
      tile(0);
      $tools[1].dataset.one = 1;
      $guide.textContent = '6×8タイルに切り替えました';
      setTimeout(nomal_guide, 2000);
      $tools[1].src = '../img/tools/floor2.svg';
      $tools[1].nextElementSibling.textContent = '2階・半2階部分の作成';
      $tools[1].dataset.one = 1;
    });

    //4×9タイル
    $tools[7].addEventListener('click', ()=> {
      tile(2);
      $tools[1].dataset.one = 1;
      $guide.textContent = '4×9タイルに切り替えました。このモードでは被災者ゾーンの自動入力機能は使えません。';
      setTimeout(nomal_guide, 2000);
      $tools[1].src = '../img/tools/floor2.svg';
      $tools[1].nextElementSibling.textContent = '2階・半2階部分の作成';
      $tools[1].dataset.one = 1;
    });

    //3×12タイル
    $tools[8].addEventListener('click', ()=> {
      tile(4);
      $tools[1].dataset.one = 1;
      $guide.textContent = '3×12タイルに切り替えました。このモードでは被災者ゾーンの自動入力機能は使えません。';
      setTimeout(nomal_guide, 2000);
      $tools[1].src = '../img/tools/floor2.svg';
      $tools[1].nextElementSibling.textContent = '2階・半2階部分の作成';
      $tools[1].dataset.one = 1;
    });

    //ヘルプ
    $tools[9].addEventListener('click', ()=> {
      window.open('help.html')
    });
    $start_tools[4].addEventListener('click', ()=> {
      window.open('help.html')
    });
    //ヘルプ(F1キー)
    window.addEventListener("keydown", function(e){
      if (e.key == "F1") {
        e.preventDefault();
        window.open('help.html')
      }
    });


    //チェックマーカー・障害物・バンプどれか1つに絞る

    function narrow_down(element){
      $contextmenu_title[2].onclick = null;
      $contextmenu_title[3].onclick = null;
      $contextmenu_title[4].onclick = null;
      $contextmenu_title[5].onclick = null;
      $contextmenu_title[6].onclick = null;
      $contextmenu_title[7].onclick = null;
      $contextmenu_title[2].className = "contextmenu-title";
      $contextmenu_title[3].className = "contextmenu-title";
      $contextmenu_title[4].className = "contextmenu-title";
      $contextmenu_title[5].className = "contextmenu-title";
      $contextmenu_title[6].className = "contextmenu-title";
      $contextmenu_title[7].className = "contextmenu-title";
      if(element.src.slice(-6) == 'se.png' || element.src.slice(-6) == 'no.png' || element.style.backgroundColor == 'rgb(221, 221, 221)'){
        //シーソータイルは、得点要素のない直線のラインである
      } else if(element.dataset.check == 1){
        $contextmenu_title[3].className = "contextmenu-title_active";
        checkOrUncheck = 1;
      }else if(element.dataset.obstacle == 1){
        $contextmenu_title[5].className = "contextmenu-title_active";
        obOrUnob = 1;
      }else if(element.dataset.bump1 != 0){
        $contextmenu_title[7].className = "contextmenu-title_active";
        bumpOrUnbump = 1;
      }else{
        $contextmenu_title[2].className = "contextmenu-title_active";
        $contextmenu_title[4].className = "contextmenu-title_active";
        $contextmenu_title[6].className = "contextmenu-title_active";
        checkOrUncheck = 0;
        obOrUnob = 0;
        bumpOrUnbump = 0;
      }
    }

    //右クリックメニュー
    function contextmenu_show (e) {
      $contextmenu.style.display = "block";
      //topとbottomの決定(もし下のスペースがなければメニューを上にずらす)
      if (window.innerHeight - e.pageY < 250) {
        $contextmenu.style.top = "auto";
        $contextmenu.style.bottom = "10px";
      } else {
        $contextmenu.style.top = e.pageY+"px";
        $contextmenu.style.bottom = "auto";
      }
      //rightとleftの決定(もし右のスペースがなければメニューを左にずらす)
      if (window.innerWidth - e.pageX < 180) {
        $contextmenu.style.right = (window.innerWidth - e.pageX) + "px";
        $contextmenu.style.left = "auto";
      } else {
        $contextmenu.style.left = e.pageX+"px";
        $contextmenu.style.right = "auto";
      }
      
      //90度回転
      $contextmenu_title[0].onclick= function() {
        nowturn = Number(e.target.dataset.turn);
        e.target.style.transform = 'rotate(' + (90 + nowturn) +'deg)';
        e.target.dataset.turn = 90 + nowturn;
      };
      //タイル情報の削除
      $contextmenu_title[1].onclick= function() {
        e.target.src = "../img/simulator/no.png";
        e.target.style.transform = 'rotate(0deg)';
        e.target.dataset.turn = 0;
        e.target.style.border = 'none';
        if (e.target.dataset.check == 1){
          e.target.nextElementSibling.remove();
          e.target.dataset.check = 0;
        }else if (e.target.dataset.obstacle == 1){
          e.target.nextElementSibling.remove();
          e.target.dataset.obstacle = 0;
        }
        for (let index = 0; index < $table.length; index++) {
          if($table[index].style.display == 'block'){
            tile(index);
          }
        }
      };
      narrow_down(e.target);
      //チェックマーカー
      if (checkOrUncheck == 0){
        $contextmenu_title[2].onclick = function() {
          newCheckMarker = document.createElement("div");
          newCheckMarker.className = "check-marker";
          e.target.parentElement.appendChild(newCheckMarker);
          e.target.dataset.check = 1;
        };
      } else {
        $contextmenu_title[3].onclick = function() {
          e.target.nextElementSibling.remove();
          e.target.dataset.check = 0;
        };
      }
      //障害物
      if (obOrUnob == 0){
        $contextmenu_title[4].onclick = function() {
          newObstacle = document.createElement("img");
          newObstacle.src = "../img/simulator/ob.svg";
          newObstacle.className = "obstacle";
          e.target.parentElement.appendChild(newObstacle);
          e.target.dataset.obstacle = 1;
        };
      } else {
        $contextmenu_title[5].onclick= function() {
          e.target.nextElementSibling.remove();
          e.target.dataset.obstacle = 0;
        };
      }
      //バンプ
      if (bumpOrUnbump == 0){
        $contextmenu_title[6].onclick = function() {
          document.getElementById('overlay').className = 'active';
          document.getElementById('bump_settings').className = 'active';
          document.getElementById('image-preview').src = e.target.src;
          document.getElementById('image-preview').style.transform = "rotate(" + e.target.dataset.turn + "deg)"
          document.getElementById('bump_decide').onclick = function(){
            newBump = document.createElement("img");
            newBump.src = "../img/simulator/bu.png";
            newBump.className = "bump";
            if(window.innerWidth < 920){
              newBump.setAttribute("style", "left: " + ($bump_input[0].value / 10) + "vw; top: " + (($bump_input[1].value - 37) / 10) + "vw; transform: rotate(" + $bump_input[2].value + "deg)");
            } else {
              newBump.setAttribute("style", "left: " + $bump_input[0].value + "px; top: " + ($bump_input[1].value - 37) + "px; transform: rotate(" + $bump_input[2].value + "deg)");
            }
            e.target.parentElement.appendChild(newBump);
            //aはただの区切り。and。
            e.target.dataset.bump1 = $bump_input[0].value + "a" + ($bump_input[1].value - 37) + "a" + $bump_input[2].value;
            newBump = null;
            //2個目
            if($bump_input_div[2].style.display == 'flex'){
              newBump = document.createElement("img");
              newBump.src = "../img/simulator/bu.png";
              newBump.className = "bump";
              if(window.innerWidth < 920){
                newBump.setAttribute("style", "left: " + ($bump_input[3].value / 10) + "vw; top: " + (($bump_input[4].value - 37) / 10) + "vw; transform: rotate(" + $bump_input[5].value + "deg)");
              } else {
                newBump.setAttribute("style", "left: " + $bump_input[3].value + "px; top: " + ($bump_input[4].value - 37) + "px; transform: rotate(" + $bump_input[5].value + "deg)");
              }
              e.target.parentElement.appendChild(newBump);
              e.target.dataset.bump2 = $bump_input[3].value + "a" + ($bump_input[4].value - 37) + "a" + $bump_input[5].value;
              newBump = null;
            }
            //3個目
            if($bump_input_div[3].style.display == 'flex'){
              newBump = document.createElement("img");
              newBump.src = "../img/simulator/bu.png";
              newBump.className = "bump";
              if(window.innerWidth < 920){
                newBump.setAttribute("style", "left: " + ($bump_input[6].value / 10) + "vw; top: " + (($bump_input[7].value - 37) / 10) + "vw; transform: rotate(" + $bump_input[8].value + "deg)");
              } else {
                newBump.setAttribute("style", "left: " + $bump_input[6].value + "px; top: " + ($bump_input[7].value - 37) + "px; transform: rotate(" + $bump_input[8].value + "deg)");
              }
              e.target.parentElement.appendChild(newBump);
              e.target.dataset.bump3 = $bump_input[6].value + "a" + ($bump_input[7].value - 37) + "a" + $bump_input[8].value;
              newBump = null;
            }
            //4個目
            if($bump_input_div[4].style.display == 'flex'){
              newBump = document.createElement("img");
              newBump.src = "../img/simulator/bu.png";
              newBump.className = "bump";
              if(window.innerWidth < 920){
                newBump.setAttribute("style", "left: " + ($bump_input[9].value / 10) + "vw; top: " + (($bump_input[10].value - 37) / 10) + "vw; transform: rotate(" + $bump_input[11].value + "deg)");
              } else {
                newBump.setAttribute("style", "left: " + $bump_input[9].value + "px; top: " + ($bump_input[10].value - 37) + "px; transform: rotate(" + $bump_input[11].value + "deg)");
              }
              e.target.parentElement.appendChild(newBump);
              e.target.dataset.bump4 = $bump_input[9].value + "a" + ($bump_input[10].value - 37) + "a" + $bump_input[11].value;
              newBump = null;
            }
            document.getElementById('overlay').className = '';
            document.getElementById('bump_settings').className = '';
          }
          document.getElementById('bump_cancel').onclick = function(){
            document.getElementById('overlay').className = '';
            document.getElementById('bump_settings').className = '';
          };
        };
      } else {
        $contextmenu_title[7].onclick= function() {
          e.target.nextElementSibling.remove();
          e.target.dataset.bump1 = 0;
          if (e.target.dataset.bump2 != 0){
            e.target.nextElementSibling.remove();
            e.target.dataset.bump2 = 0;
          }
          if (e.target.dataset.bump3 != 0){
            e.target.nextElementSibling.remove();
            e.target.dataset.bump3 = 0;
          }
          if (e.target.dataset.bump4 != 0){
            e.target.nextElementSibling.remove();
            e.target.dataset.bump4 = 0;
          }
        };
      }
    }

    let count_tap = 0;
    let contextmenu_showed = 0;
    for (let index = 0; index < imgLen; index++) {
      $img[index].addEventListener('contextmenu', (e) => {
        e.preventDefault();
        contextmenu_show(e);
      });
      $img[index].addEventListener('touchstart', (e) => {
        long_tap_timer = setInterval(() => {
          count_tap++;
          if (count_tap > 5 && contextmenu_showed == 0){
            contextmenu_show(e.changedTouches[0]);
            contextmenu_showed = 1;
          }
        }, 100);
      },{passive: true});
      $img[index].addEventListener('touchend', () => {
        clearInterval(long_tap_timer);
        count_tap = 0;
        contextmenu_showed = 0;
      });
    }

    //右クリックメニュー非表示
    document.body.addEventListener('click',function (){
      $contextmenu.style.display="none";
    });
  })();