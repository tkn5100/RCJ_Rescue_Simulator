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
    const $league = $doc.getElementsByName('league');
    const $table = $doc.getElementsByTagName('table');
    // const $index = document.getElementsByClassName('index')
    const $coursedata = $doc.getElementsByClassName('coursedata');
    const $bump_input = document.getElementsByClassName('bump-input');
    const $bump_input_div = document.querySelectorAll('#bump_settings > div');
    let nowturn = null;
    let src = null;
    let secondOrFirst = null;
    let checkOrUncheck = null;
    let newCheckMarker = null;
    let obOrUnob = null;
    let newObstacle = null;
    let bumpOrUnbump_1 = null;
    let bumpOrUnbump_2 = null;
    let bumpOrUnbump_3 = null;
    let bumpOrUnbump_4 = null;
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


    function nomal_guide() {
      if(document.getElementById('nrl-tiles').style.display == 'block'){
        $guide.textContent = 'タイルをダブルクリックすると時計回りに90度回転します';
      } else {
        if($tools[1].dataset.one == 1){
          $guide.textContent = 'ただいま1階部分を作成中です';
        }else{
          $guide.textContent = 'ただいま2階・半2階部分を作成中です';
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
              auto_save();
            });
          }
        });
      }
    }
    course_input();

    //タイル情報
    function course_data() {
      for (let index = 0; index < $coursedata.length; index++) {
        $coursedata[index].addEventListener('click', (e) => {
          data = e.target.style.border
          for (let i = 0; i < imgLen; i++) {
            $img[i].addEventListener('click', (e)=> {
              e.target.style.border = data;
            });
          }
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

    function tile(arg) {
      $table[0].style.display = 'none';
      $table[1].style.display = 'none';
      $table[2].style.display = 'none';
      $table[3].style.display = 'none';
      $table[4].style.display = 'none';
      $table[5].style.display = 'none';
      $table[arg].style.display = 'block';
    }

    //2階・半2階
    $tools[1].addEventListener('click', () => {
      if($tools[1].dataset.one == 1){
        if($table[1].style.display == 'block'){
          tile(1);
        }else if ($table[2].style.display == 'block'){
          tile(3);
        }else if($table[4].style.display == 'block'){
          tile(5);
        }
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
        $tools[2].textContent = 'グリッドの表示';
        $tools[2].dataset.grid = 0;
        $guide.textContent = 'グリッドを表示しています';
        setTimeout(nomal_guide, 2000);
      }else{
        for (let index = 0; index < imgLen; index++) {
          $doc.getElementsByTagName('td')[index].style.border = '1px solid #AAAAAA';
        }
        $tools[2].textContent = 'グリッドの非表示';
        $tools[2].dataset.grid = 1;
        $guide.textContent = 'グリッドを非表示にしました';
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
        output_data[0].push("v3.1.0");
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
        for (let index = 0; index < imgLen; index++) {
          output_data[2].push("../img/simulator/" + $img[index].src.slice(-6));
          output_data[3].push($img[index].dataset.turn);
          if ($img[index].style.border =="1px solid rgb(102, 51, 102)"){
            output_data[4].push("solid 1px #663366");
          }else if ($img[index].style.border =="1px solid rgb(153, 51, 102)"){
            output_data[4].push("solid 1px #993366");
          }else if ($img[index].style.border =="1px solid rgb(204, 51, 102)"){
            output_data[4].push("solid 1px #CC3366");
          }else if ($img[index].style.border =="1px solid rgb(255, 51, 102)"){
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
        download.download = filename + ".rrl";
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
      for (let index = 0; index < $league.length; index++) {
        if ($league[index].checked) {
          if (localStorage.hasOwnProperty("rrl_auto-save_league")){
            localStorage.removeItem("rrl_auto-save_league");
          }
          if(index == 0){
            localStorage.setItem("rrl_auto-save_league", "nrl");
            document.getElementById('wrl-tiles').style.display = 'none';
            document.getElementById('nrl-tiles').style.display = 'block';
            $tools[1].style.display = 'none';
          } else {
            localStorage.setItem("rrl_auto-save_league", "wrl");
            document.getElementById('wrl-tiles').style.display = 'block';
            document.getElementById('nrl-tiles').style.display = 'none';
            $tools[1].style.display = 'block';
          }
        }
      }
    });


    //プロジェクトの読み込み
    let reader = new FileReader();
    document.getElementById('input_file').addEventListener('change', () => {
      if (document.getElementById('input_file').files[0].name.slice(-3) === 'rrl') {
        document.getElementById('overlay').className = "";
        document.getElementById('start').className = "";
        file = document.getElementById('input_file').files[0];
        reader.readAsText(file);
        reader.onload = function () {
          csv_arrays = reader.result.split('\n');
          if (csv_arrays[0] == "v3.0.0," || csv_arrays[0] == "v3.0.1," || csv_arrays[0] == "v3.1.0,") {
            try{
              input_data_show = csv_arrays[1].split(',')[1];
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
          } else if (csv_arrays[0] == "v2.0.0," || csv_arrays[0] == "v2.0.1," || csv_arrays[0] == "v2.0.2,") {
            try{
              input_data_course = csv_arrays[1].split(',');
              input_data_turn = csv_arrays[2].split(',');
              input_data_border = csv_arrays[3].split(',');
              input_data_check = csv_arrays[4].split(',');
              input_data_obstacle = csv_arrays[5].split(',');
              input_data_bump1 = csv_arrays[6].split(',');
              input_data_bump2 = csv_arrays[7].split(',');
              input_data_bump3 = csv_arrays[8].split(',');
              input_data_bump4 = csv_arrays[9].split(',');
            }catch (e){
              window.alert('エラー:データの読み込みに失敗しました。ファイルが破損している可能性があります。ページを再読み込みします。')
              window.location.reload();
            }
            input_data_show = 0;
            for (let index = 0; index < input_data_course.length; index++){
              input_data_course[index] = '../img/simulator/' + input_data_course[index].slice(-6);
            }
            window.alert('このファイルはv2.0.xで作成されたものです。もう1度プロジェクトを保存すると最新版相当になります。')
          } else {
            window.alert('このファイルはv1.x.xで作成されたものです。利用するには最新版に変換してください。ページを再読み込みします。')
            window.location.reload();
          }

          all_clear();
          for (let index = 0; index < imgLen; index++) {
            //コート
            tile(input_data_show);
            if (input_data_show == 1 || input_data_show == 3 || input_data_show == 5){
              $tools[1].src = '../img/tools/floor1.svg';
              $tools[1].nextElementSibling.textContent = '1階部分の作成';
              $tools[1].dataset.one = 2;
              nomal_guide();
            }
            //タイル
            $img[index].src = input_data_course[index + 1];
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
          document.getElementById('input_file').value = '';
          $guide.textContent = 'プロジェクトを読み込みました';
          setTimeout(nomal_guide, 2000);
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

    //残り全部を白にする
    $tools[6].addEventListener('click', ()=> {
      for (let index = 0; index < imgLen; index++) {
        if($img[index].src.lastIndexOf('no.png') !== -1){
          $img[index].src = '../img/simulator/wt.png';
        }
      }
      auto_save();
      $guide.textContent = '未入力のタイルをすべて白色にしました';
      setTimeout(nomal_guide, 2000);
    });


    //6×8タイル
    $tools[7].addEventListener('click', ()=> {
      tile(0);
      $tools[1].dataset.one = 1;
      $guide.textContent = '6×8タイルに切り替えました';
      setTimeout(nomal_guide, 2000);
      $tools[1].src = '../img/tools/floor2.svg';
      $tools[1].nextElementSibling.textContent = '2階・半2階部分の作成';
      $tools[1].dataset.one = 1;
    });

    //4×9タイル
    $tools[8].addEventListener('click', ()=> {
      tile(2);
      $tools[1].dataset.one = 1;
      $guide.textContent = '4×9タイルに切り替えました。このモードでは被災者ゾーンの自動入力機能は使えません。';
      setTimeout(nomal_guide, 2000);
      $tools[1].src = '../img/tools/floor2.svg';
      $tools[1].nextElementSibling.textContent = '2階・半2階部分の作成';
      $tools[1].dataset.one = 1;
    });

    //3×12タイル
    $tools[9].addEventListener('click', ()=> {
      tile(4);
      $tools[1].dataset.one = 1;
      $guide.textContent = '3×12タイルに切り替えました。このモードでは被災者ゾーンの自動入力機能は使えません。';
      setTimeout(nomal_guide, 2000);
      $tools[1].src = '../img/tools/floor2.svg';
      $tools[1].nextElementSibling.textContent = '2階・半2階部分の作成';
      $tools[1].dataset.one = 1;
    });

    //ヘルプ
    $tools[10].addEventListener('click', ()=> {
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
    function narrow_down(arg){
      document.getElementsByClassName('contextmenu-title')[2].style.color = "#AAAAAA";
      document.getElementsByClassName('contextmenu-title')[2].style.cursor = "default";
      document.getElementsByClassName('contextmenu-title')[3].style.color = "#AAAAAA";
      document.getElementsByClassName('contextmenu-title')[3].style.cursor = "default";
      document.getElementsByClassName('contextmenu-title')[4].style.color = "#AAAAAA";
      document.getElementsByClassName('contextmenu-title')[4].style.cursor = "default";
      document.getElementsByClassName('contextmenu-title')[5].style.color = "#AAAAAA";
      document.getElementsByClassName('contextmenu-title')[5].style.cursor = "default";
      document.getElementsByClassName('contextmenu-title')[6].style.color = "#AAAAAA";
      document.getElementsByClassName('contextmenu-title')[6].style.cursor = "default";
      document.getElementsByClassName('contextmenu-title')[7].style.color = "#AAAAAA";
      document.getElementsByClassName('contextmenu-title')[7].style.cursor = "default";

      if($img[arg].dataset.check == 1){
        document.getElementsByClassName('contextmenu-title')[3].style.color = "#000000";
        document.getElementsByClassName('contextmenu-title')[3].style.cursor = "pointer";
        checkOrUncheck = 1;
      }else if($img[arg].dataset.obstacle == 1){
        document.getElementsByClassName('contextmenu-title')[5].style.color = "#000000";
        document.getElementsByClassName('contextmenu-title')[5].style.cursor = "pointer";
        obOrUnob = 1;
      }else if($img[arg].dataset.bump1 != 0){
        document.getElementsByClassName('contextmenu-title')[7].style.color = "#000000";
        document.getElementsByClassName('contextmenu-title')[7].style.cursor = "pointer";
        bumpOrUnbump_1 = 1;
        if ($img[arg].dataset.bump2 != 0){
          bumpOrUnbump_2 = 1;
        }
        if ($img[arg].dataset.bump3 != 0){
          bumpOrUnbump_3 = 1;
        }
        if ($img[arg].dataset.bump4 != 0){
          bumpOrUnbump_4 = 1;
        }
      }else{
        document.getElementsByClassName('contextmenu-title')[2].style.color = "#000000";
        document.getElementsByClassName('contextmenu-title')[2].style.cursor = "pointer";
        document.getElementsByClassName('contextmenu-title')[4].style.color = "#000000";
        document.getElementsByClassName('contextmenu-title')[4].style.cursor = "pointer";
        document.getElementsByClassName('contextmenu-title')[6].style.color = "#000000";
        document.getElementsByClassName('contextmenu-title')[6].style.cursor = "pointer";
        checkOrUncheck = 0;
        obOrUnob = 0;
        bumpOrUnbump_1 = 0;
      }
    }


    //右クリックメニュー
    for (let index = 0; index < imgLen; index++) {
      secondOrFirst = null;
      $img[index].addEventListener('contextmenu', (e) => {
        e.preventDefault();
        document.getElementById('contextmenu').style.display = "block";
        //topとbottomの決定(もし下のスペースがなければメニューを上にずらす)
        if (window.innerHeight - e.pageY < 250) {
          document.getElementById('contextmenu').style.top = "auto";
          document.getElementById('contextmenu').style.bottom = "10px";
        } else {
          document.getElementById('contextmenu').style.top = e.pageY+"px";
          document.getElementById('contextmenu').style.bottom = "auto";
        }
        //rightとleftの決定(もし右のスペースがなければメニューを左にずらす)
        if (window.innerWidth - e.pageX < 180) {
          document.getElementById('contextmenu').style.right = (window.innerWidth - e.pageX) + "px";
          document.getElementById('contextmenu').style.left = "auto";
        } else {
          document.getElementById('contextmenu').style.left = e.pageX+"px";
          document.getElementById('contextmenu').style.right = "auto";
        }
        
        //90度回転
        document.getElementsByClassName('contextmenu-title')[0].onclick= function() {
          nowturn = Number(e.target.dataset.turn);
          $img[index].style.transform = 'rotate(' + (90 + nowturn) +'deg)';
          $img[index].dataset.turn = 90 + nowturn;
        };
        //タイル情報の削除
        document.getElementsByClassName('contextmenu-title')[1].onclick= function() {
          $img[index].src = "../img/simulator/no.png";
          $img[index].style.transform = 'rotate(0deg)';
          $img[index].dataset.turn = 0;
          $img[index].style.border = 'none';
          $img[index].dataset.floor = 0;
          if ($img[index].dataset.check == 1){
            $img[index].nextElementSibling.remove();
            $img[index].dataset.check = 0;
          }else if ($img[index].dataset.obstacle == 1){
            $img[index].nextElementSibling.remove();
            $img[index].dataset.obstacle = 0;
          }
        };
        narrow_down(index);
          //チェックマーカー
        if (checkOrUncheck == 0){
          document.getElementsByClassName('contextmenu-title')[2].onclick = function(){
            newCheckMarker = document.createElement("div");
            newCheckMarker.className = "check-marker";
            $img[index].parentElement.appendChild(newCheckMarker);
            $img[index].dataset.check = 1;
          }
          document.getElementsByClassName('contextmenu-title')[3].onclick = function(){}
        } else {
          document.getElementsByClassName('contextmenu-title')[3].onclick = function() {
            $img[index].nextElementSibling.remove();
            $img[index].dataset.check = 0;
          };
          document.getElementsByClassName('contextmenu-title')[2].onclick = function(){}
        }
        //障害物
        if (obOrUnob == 0){
          document.getElementsByClassName('contextmenu-title')[4].onclick = function() {
            newObstacle = document.createElement("img");
            newObstacle.src = "../img/simulator/ob.svg";
            newObstacle.className = "obstacle";
            $img[index].parentElement.appendChild(newObstacle);
            $img[index].dataset.obstacle = 1;
          };
          document.getElementsByClassName('contextmenu-title')[5].onclick = function(){}
        } else {
          document.getElementsByClassName('contextmenu-title')[5].onclick= function() {
            $img[index].nextElementSibling.remove();
            $img[index].dataset.obstacle = 0;
          };
          document.getElementsByClassName('contextmenu-title')[4].onclick = function(){}
        }
        //バンプ
        if (bumpOrUnbump_1 == 0){
          document.getElementsByClassName('contextmenu-title')[6].onclick = function() {
            document.getElementById('overlay').className = 'active';
            document.getElementById('bump_settings').className = 'active';
            document.getElementById('image-preview').src = $img[index].src;
            document.getElementById('image-preview').style.transform = "rotate(" + $img[index].dataset.turn + "deg)"
            document.getElementById('bump_decide').onclick = function(){
              newBump = document.createElement("img");
              newBump.src = "../img/simulator/bu.png";
              newBump.className = "bump";
              if(window.innerWidth < 920){
                newBump.setAttribute("style", "left: " + ($bump_input[0].value / 10) + "vw; top: " + (($bump_input[1].value - 37) / 10) + "vw; transform: rotate(" + $bump_input[2].value + "deg)");
              } else {
                newBump.setAttribute("style", "left: " + $bump_input[0].value + "px; top: " + ($bump_input[1].value - 37) + "px; transform: rotate(" + $bump_input[2].value + "deg)");
              }
              $img[index].parentElement.appendChild(newBump);
              //aはただの区切り。and。
              $img[index].dataset.bump1 = $bump_input[0].value + "a" + ($bump_input[1].value - 37) + "a" + $bump_input[2].value;
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
                $img[index].parentElement.appendChild(newBump);
                $img[index].dataset.bump2 = $bump_input[3].value + "a" + ($bump_input[4].value - 37) + "a" + $bump_input[5].value;
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
                $img[index].parentElement.appendChild(newBump);
                $img[index].dataset.bump3 = $bump_input[6].value + "a" + ($bump_input[7].value - 37) + "a" + $bump_input[8].value;
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
                $img[index].parentElement.appendChild(newBump);
                $img[index].dataset.bump4 = $bump_input[9].value + "a" + ($bump_input[10].value - 37) + "a" + $bump_input[11].value;
                newBump = null;
              }
              document.getElementById('overlay').className = '';
              document.getElementById('bump_settings').className = '';
            }
            document.getElementById('bump_cancel').onclick = function(){
              document.getElementById('overlay').className = '';
              document.getElementById('bump_settings').className = '';
            }
          };
          document.getElementsByClassName('contextmenu-title')[7].onclick = function(){}
        } else {
          document.getElementsByClassName('contextmenu-title')[7].onclick= function() {
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
          };
          document.getElementsByClassName('contextmenu-title')[6].onclick = function(){}
        }
      });
    }

    //右クリックメニュー非表示
    document.body.addEventListener('click',function (){
      document.getElementById('contextmenu').style.display="none";
    });


  })();