(()=>{
    const $doc = document;
    const $guide = $doc.getElementById('guidetext');
    const $img = $doc.getElementsByClassName('image');
    const imgLen = $img.length;
    const $tools = $doc.getElementsByClassName('tools');
    const $start_tools = $doc.getElementsByClassName('start_tools');
    const $table = $doc.getElementsByTagName('table');
    const $contextmenu_title = document.getElementsByTagName('li');
    const $contextmenu = document.getElementById('contextmenu');
    let checkOrUncheck = null;
    let newCheckMarker = null;
    let newObstacle = null;
    let newBump = null;
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
    let time = 480;
    let show_second = null;
    let show_minute = null;
    let score = 0;
    //以下カウント用
    let start_tile = 0;
    let check_marker = 0;
    let stop_count = 0;
    let passed_tiles = 0;
    let escaped = 0;
    //以下競技詳細用
    let nowSection = 1; //の区間1,2,…の判定。
    let newSectionTag = null;
    let cleared_bumps= 0;
    let cleared_obstacles = 0;
    let cleared_gaps = 0;
    let cleared_slopes = 0;
    let cleared_green = 0; //緑の被災者
    let cleared_black = 0;

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
      $guide.textContent = 'タイルをクリックすると通過済み(青)になります。';
    };

    //得点
    function get_points(num) {
      score = score + num;
      document.getElementById('score').innerHTML = score + '<span id="added_score">+' + num + '</span>';
      document.getElementById('statistics_score').textContent = score + '点';
      setTimeout(delete_points_guide, 2000);
      $guide.textContent = num + '点を獲得しました';
      setTimeout(nomal_guide, 2000);
    }
    function lose_points(num) {
      score = score - num;
      document.getElementById('score').innerHTML = score + '<span id="added_score">-' + num + '</span>';
      document.getElementById('statistics_score').textContent = score + '点';
      setTimeout(delete_points_guide, 2000);
      $guide.textContent = num + '点を取り消しました';
      setTimeout(nomal_guide, 2000);
    }
    function delete_points_guide (){
      document.getElementById('score').innerHTML = score;
    }

    //タイマー
    function count() {
      time--;
      show_second = time % 60;
      show_minute = Math.floor(time / 60);
      if (show_second < 10) {
        show_second = "0" + show_second;
      }
      document.getElementById("timer").textContent = show_minute + ":" + show_second;
      if (time <= 0) {
        clearInterval(TimerID);
        setTimeout('alert("競技を終了して下さい")', 500);
      }
    }
    document.getElementById('timer_start').addEventListener('click', function () {
      TimerID = setInterval(count, 1000);
      document.getElementById("timer_start").disabled = true;
      time = 480;
      document.getElementById("timer").textContent = "8:00";
      get_points(5);
      newSectionTag = document.createElement("p");
      newSectionTag.textContent = '区間0 : 5点(スタートタイル)';
      document.getElementById('statistics_line').appendChild(newSectionTag);
    });
    document.getElementById('timer_stop').addEventListener('click', function () {
      clearInterval(TimerID);
      document.getElementById("timer_stop").disabled = true;
      document.getElementsByClassName('button_hinan')[0].disabled = true;
      document.getElementsByClassName('button_hinan')[1].disabled = true;
      document.getElementsByClassName('button_hinan')[2].disabled = true;
      for (let index = 1; index < imgLen; index++) {
        $img[index].style.pointerEvents = 'none';
      }
      $guide.textContent = '競技を終了しました。コートの編集はロックされています。新しく競技を開始するには再読み込みしてください。';
    });

    //チェックポイント 1-は、前のチェックポイントで1回分数えたということ
    for (let index = 1; index < imgLen; index++) {
      $img[index].addEventListener('click', function (e) {
        if (document.getElementById("timer_start").hasAttribute('disabled')){
        } else {
          window.alert('先に競技を開始してください。')
        }
        if (e.target.dataset.check == '0'){
          if (e.target.dataset.passed == '1' && e.target.src.slice(-6) == '25.png'){
            e.target.parentElement.style.backgroundColor = '#8EF1FF';
            e.target.dataset.passed = '2';
          } else if (e.target.dataset.passed == '1' && e.target.src.slice(-6) == '33.png'){
            e.target.parentElement.style.backgroundColor = '#8EF1FF';
            e.target.dataset.passed = '2';
          } else if (e.target.dataset.passed == '1-' && e.target.src.slice(-6) == '25.png'){
            e.target.parentElement.style.backgroundColor = '#8EF1FF';
            e.target.dataset.passed = '2-';
          } else if (e.target.dataset.passed == '1-' && e.target.src.slice(-6) == '33.png'){
            e.target.parentElement.style.backgroundColor = '#8EF1FF';
            e.target.dataset.passed = '2-';
          } else {
            e.target.parentElement.style.backgroundColor = '#C2EEFF';
            e.target.dataset.passed = '1';
          }
        } else {
          for (let index = 1; index < imgLen; index++) {
            if ($img[index].dataset.passed == '1'){
              passed_tiles++;
              if($img[index].src.slice(-6) == '25.png' || $img[index].src.slice(-6) == '33.png'){
                $img[index].dataset.passed = '1-';
              } else {
                $img[index].dataset.passed = '0';
                $img[index].parentElement.style.backgroundColor = '#FFFFFF';
                $img[index].style.pointerEvents = 'none';
                $img[index].style.boxShadow = 'none';
              }
            } else if ($img[index].dataset.passed == '2'){
              passed_tiles = passed_tiles + 2;
              $img[index].dataset.passed = '0';
              $img[index].parentElement.style.backgroundColor = '#FFFFFF';
              $img[index].style.pointerEvents = 'none';
              $img[index].style.boxShadow = 'none';
            } else if ($img[index].dataset.passed == '2-'){
              passed_tiles++;
              $img[index].dataset.passed = '0';
              $img[index].parentElement.style.backgroundColor = '#FFFFFF';
              $img[index].style.pointerEvents = 'none';
              $img[index].style.boxShadow = 'none';
            }
          }
          //↓チェックマーカーがあるタイルの分
          passed_tiles++;
          e.target.parentElement.style.backgroundColor = '#FFFFFF';
          e.target.style.pointerEvents = 'none';
          if (stop_count == '0'){
            get_points(passed_tiles * 5);
            newSectionTag = document.createElement("p");
            newSectionTag.textContent = '区間' + nowSection + ' : 5点 × ' + passed_tiles + 'タイル = ' + passed_tiles * 5 + '点';
            document.getElementById('statistics_line').appendChild(newSectionTag);
          } else if (stop_count == '1'){
            get_points(passed_tiles * 3);
            newSectionTag = document.createElement("p");
            newSectionTag.textContent = '区間' + nowSection + ' : 3点 × ' + passed_tiles + 'タイル = ' + passed_tiles * 3 + '点';
            document.getElementById('statistics_line').appendChild(newSectionTag);
          } else if (stop_count == '2'){
            get_points(passed_tiles * 1);
            newSectionTag = document.createElement("p");
            newSectionTag.textContent = '区間' + nowSection + ' : 1点 × ' + passed_tiles + 'タイル = ' + passed_tiles * 1 + '点';
            document.getElementById('statistics_line').appendChild(newSectionTag);
          } else {
            window.alert('競技進行の停止が3回以上行われているので得点はありません。');
            newSectionTag = document.createElement("p");
            newSectionTag.textContent = '区間' + nowSection + ' : 0点 × ' + passed_tiles + 'タイル = 0点';
            document.getElementById('statistics_line').appendChild(newSectionTag);
          }
          nowSection++;
          passed_tiles = 0;
          stop_count = 0;
          document.getElementById('stop_count').textContent = '0';
        }
      });
    }

    //得点要素
    let hazard_show = 0;
    function hazard_dialog (e) {
      hazard_show = 1;
      document.querySelector('#hazard_img > img').style.boxShadow = '';
      document.getElementById('hazard_out').style.display = "block";
      //topとbottomの決定(もし下のスペースがなければメニューを上にずらす)
      if (window.innerHeight - e.pageY < 155) {
        document.getElementById('hazard_out').style.top = "auto";
        document.getElementById('hazard_out').style.bottom = window.innerHeight - e.pageY + "px";
      } else {
        document.getElementById('hazard_out').style.top = e.pageY + "px";
        document.getElementById('hazard_out').style.bottom = "auto";
      }
      //rightとleftの決定(もし右のスペースがなければメニューを左にずらす)
      if (window.innerWidth - e.pageX < 300) {
        document.getElementById('hazard_out').style.right = (window.innerWidth - e.pageX) + "px";
        document.getElementById('hazard_out').style.left = "auto";
      } else {
        document.getElementById('hazard_out').style.left = e.pageX + "px";
        document.getElementById('hazard_out').style.right = "auto";
      }
      if (e.target.classList.contains('bump')) {
        //バンプ
        document.getElementById('hazard_name').textContent = '減速バンプ';
        document.getElementById('hazard_score').textContent = '5';
        document.querySelector('#hazard_img > img').src = '../img/simulator/bu.png';
        if (e.target.dataset.cleared == '0') {
          document.querySelector('#hazard_img > img').className = 'bump';
          document.getElementById('hazard_status').textContent = 'これからクリア';
        } else {
          document.querySelector('#hazard_img > img').className = 'bump cleared';
          document.getElementById('hazard_status').textContent = 'クリア済み';
        }
        document.getElementById('hazard_clear').textContent = 'クリア';
        document.getElementById('hazard_clear2').style.display = 'none';
        hazard_clear(e.target,'バンプ');
      } else if (e.target.classList.contains('obstacle')) {
        //障害物
        document.getElementById('hazard_name').textContent = '障害物';
        document.getElementById('hazard_score').textContent = '15';
        document.querySelector('#hazard_img > img').src = '../img/simulator/ob.svg';
        if (e.target.dataset.cleared == '0') {
          document.querySelector('#hazard_img > img').className = 'obstacle';
          document.getElementById('hazard_status').textContent = 'これからクリア';
        } else {
          document.querySelector('#hazard_img > img').className = 'obstacle cleared';
          document.getElementById('hazard_status').textContent = 'クリア済み';
        }
        document.getElementById('hazard_clear').textContent = 'クリア';
        document.getElementById('hazard_clear2').style.display = 'none';
        hazard_clear(e.target,'障害物');
      } else if (e.target.src.slice(-6) == '03.png') {
        //ギャップ1個
        document.getElementById('hazard_name').textContent = 'ギャップ';
        document.getElementById('hazard_score').textContent = '10';
        document.querySelector('#hazard_img > img').src = '../img/simulator/03.png';
        document.querySelector('#hazard_img > img').className = 'image_hazard';
        if (e.target.dataset.cleared == '0'){
          document.getElementById('hazard_status').textContent = 'これからクリア';
        } else {
          document.querySelector('#hazard_img > img').style.boxShadow = '0 0 5px #888888';
          document.getElementById('hazard_status').textContent = 'クリア済み';
        }
        document.getElementById('hazard_clear').textContent = 'クリア';
        document.getElementById('hazard_clear2').style.display = 'none';
        hazard_clear(e.target,'ギャップ');
      } else if (e.target.src.slice(-6) == '04.png' || e.target.src.slice(-6) == '33.png') {
        //ギャップ2個
        document.getElementById('hazard_name').textContent = 'ギャップ(2)';
        document.getElementById('hazard_score').textContent = '10';
        document.querySelector('#hazard_img > img').src = '../img/simulator/' + e.target.src.slice(-6);
        document.querySelector('#hazard_img > img').className = 'image_hazard';
        if (e.target.dataset.cleared == '0'){
          document.getElementById('hazard_status').textContent = 'これからクリア';
        } else if (e.target.dataset.cleared == '1'){
          document.getElementById('hazard_status').textContent = '1つクリア済み';
        } else if (e.target.dataset.cleared == '2'){
          document.querySelector('#hazard_img > img').style.boxShadow = '0 0 5px #888888';
          document.getElementById('hazard_status').textContent = 'すべてクリア済み';
        }
        document.getElementById('hazard_clear').textContent = 'クリア(1)';
        document.getElementById('hazard_clear2').style.display = 'block';
        document.getElementById('hazard_clear2').textContent = 'クリア(2)';
        hazard_clear(e.target,'ギャップ');
        hazard_clear2(e.target);
      } else if (e.target.style.border == "1px solid rgb(102, 51, 102)" || e.target.style.border == "1px solid rgb(204, 51, 102)") {
        //傾斜路
        document.getElementById('hazard_name').textContent = '傾斜路';
        document.getElementById('hazard_score').textContent = '10';
        document.querySelector('#hazard_img > img').src = e.target.src;
        document.querySelector('#hazard_img > img').className = 'image_hazard';
        if (e.target.dataset.cleared == '0'){
          document.getElementById('hazard_status').textContent = 'これからクリア';
        } else {
          document.querySelector('#hazard_img > img').style.boxShadow = '0 0 5px #888888';
          document.getElementById('hazard_status').textContent = 'クリア済み';
        }
        document.getElementById('hazard_clear').textContent = 'クリア';
        document.getElementById('hazard_clear2').style.display = 'none';
        hazard_clear(e.target,'傾斜路');
      }
    }

    function hazard_button(element, class_name){
      element.style.display = 'block';
      if (element.classList.contains('cleared')){
        element.classList.remove('cleared')
      }
      if (element.classList.contains('disabled')){
        element.classList.remove('disabled')
      }
      if (class_name == null){
      } else {
        element.classList.add(class_name);
      }
    }

    function hazard_clear(element,type) {
      if (element.dataset.cleared == '0'){
        hazard_button(document.getElementById('hazard_clear'), null);
        document.getElementById('hazard_clear').onclick = function(){
          element.dataset.cleared = '1';
          element.classList.add('cleared');
          if (element.src.slice(-6) == '03.png' || element.style.border == "1px solid rgb(102, 51, 102)" || element.style.border == "1px solid rgb(204, 51, 102)") {
            element.style.boxShadow = '0 0 5px #888888';
          }
          get_points(Number(document.getElementById('hazard_score').textContent));
          if (type == 'バンプ'){
            cleared_bumps++;
            document.getElementById('statistics_bump').textContent = '5点 × ' + cleared_bumps + '個 =  ' + cleared_bumps * 5 + '点';
          } else if (type == '障害物'){
            cleared_obstacles++;
            document.getElementById('statistics_obstacle').textContent = '15点 × ' + cleared_obstacles + '個 =  ' + cleared_obstacles * 15 + '点';
          } else if (type == 'ギャップ'){
            cleared_gaps++;
            document.getElementById('statistics_gap').textContent = '10点 × ' + cleared_gaps + '個 =  ' + cleared_gaps * 10 + '点';
          } else if (type == '傾斜路'){
            cleared_slopes++;
            document.getElementById('statistics_slope').textContent = '10点 × ' + cleared_slopes + '個 =  ' + cleared_slopes * 10 + '点';
          }
        };
      } else {
        hazard_button(document.getElementById('hazard_clear'),'cleared');
        document.getElementById('hazard_clear').textContent = '取り消し';
        document.getElementById('hazard_clear').onclick = function () {
          element.classList.remove('cleared');
          if (element.src.slice(-6) == '03.png' || element.style.border == "1px solid rgb(102, 51, 102)" || element.style.border == "1px solid rgb(204, 51, 102)") {
            element.style.boxShadow = '0 0 5px #FFD700';
          }
          element.dataset.cleared = '0';
          lose_points(Number(document.getElementById('hazard_score').textContent));
          if (type == 'バンプ'){
            cleared_bumps--;
            document.getElementById('statistics_bump').textContent = '5点 × ' + cleared_bumps + '個 =  ' + cleared_bumps * 5 + '点';
          } else if (type == '障害物'){
            cleared_obstacles--;
            document.getElementById('statistics_obstacle').textContent = '15点 × ' + cleared_obstacles + '個 =  ' + cleared_obstacles * 15 + '点';
          } else if (type == 'ギャップ'){
            cleared_gaps--;
            document.getElementById('statistics_gap').textContent = '10点 × ' + cleared_gaps + '個 =  ' + cleared_gaps * 10 + '点';
          } else if (type == '傾斜路'){
            cleared_slopes--;
            document.getElementById('statistics_slope').textContent = '10点 × ' + cleared_slopes + '個 =  ' + cleared_slopes * 10 + '点';
          }
        }
      }
    };
    function hazard_clear2(element) {
      if (element.dataset.cleared == '0'){
        hazard_button(document.getElementById('hazard_clear2'),'disabled');
        document.getElementById('hazard_clear2').onclick = function () {
          window.alert('先に1つ目をクリアしてください。');
        }
      } else if (element.dataset.cleared == '1'){
        hazard_button(document.getElementById('hazard_clear2'), null);
        document.getElementById('hazard_clear2').onclick = function(){
          element.style.boxShadow = '0 0 5px #888888';
          element.dataset.cleared = '2';
          get_points(10);
          cleared_gaps++;
          document.getElementById('statistics_gap').textContent = '10点 × ' + cleared_gaps + '個 =  ' + cleared_gaps * 10 + '点';
        };
      } else {
        hazard_button(document.getElementById('hazard_clear2'),'cleared');
        document.getElementById('hazard_clear').style.display = 'none';
        document.getElementById('hazard_clear2').textContent = '取り消し';
        document.getElementById('hazard_clear2').onclick = function () {
          element.style.boxShadow = '0 0 5px #FFD700';
          element.dataset.cleared = '0';
          //このボタンはギャップ2個以外では表示されない
          lose_points(20);
          cleared_gaps = cleared_gaps - 2;
          document.getElementById('statistics_gap').textContent = '10点 × ' + cleared_gaps + '個 =  ' + cleared_gaps * 10 + '点';
        }
      }
    };

    //避難ゾーン
    document.getElementsByClassName('button_hinan')[0].addEventListener('click', () => {
      get_points(30);
      cleared_green++;
      document.getElementById('statistics_green').textContent = '30点 × ' + cleared_green + '人 = ' + cleared_green * 30 + '点';
    });
    document.getElementsByClassName('button_hinan')[1].addEventListener('click', () => {
      get_points(15);
      cleared_black++;
      document.getElementById('statistics_black').textContent = '15点 × ' + cleared_black + '人 = ' + cleared_black * 15 + '点';
    });
    document.getElementsByClassName('button_hinan')[2].addEventListener('click', () => {
      if (escaped == 0){
        escaped = 1;
        get_points(30);
        document.getElementById('statistics_clear').textContent = '脱出済み 30点';
      } else {
        window.alert('すでに避難ゾーンを脱出しています。');
      }
    });


    //スタート画面に戻る
    $tools[0].addEventListener('click', () => {
      document.getElementById('overlay').className = "active";
      document.getElementById('start').className = "active";
      $start_tools[1].style.display = 'block';
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

    //グリッドの表示・非表示
    $tools[1].addEventListener('click', () => {
      if($tools[1].dataset.grid == 1){
        //tdとimgの数は一緒
        for (let index = 0; index < imgLen; index++) {
          $doc.getElementsByTagName('td')[index].style.border = 'none';
        }
        $tools[1].nextElementSibling.textContent = 'グリッドの非表示';
        $tools[1].dataset.grid = 0;
        $guide.textContent = 'グリッドを非表示にしました';
        setTimeout(nomal_guide, 2000);
      }else{
        for (let index = 0; index < imgLen; index++) {
          $doc.getElementsByTagName('td')[index].style.border = '1px solid #AAAAAA';
        }
        $tools[1].nextElementSibling.textContent = 'グリッドの表示';
        $tools[1].dataset.grid = 1;
        $guide.textContent = 'グリッドを表示しています';
        setTimeout(nomal_guide, 2000);
      }
    });

    //プロジェクトの読み込み
    function import_project() {
      for (let index = 0; index < imgLen; index++) {
        //コート
        tile(input_data_show[1]);
        //NRL・WRL
        if(input_data_show[2] == 'nrl'){
        } else {
          window.alert('この得点計算ツールはNRL専用です。WRL向けの得点計算をご利用ください。');
          break;
        }
        //タイル
        $img[index].src = input_data_course[index + 1];
        if (input_data_course[index + 1] == '../img/simulator/03.png' || input_data_course[index + 1] == '../img/simulator/04.png' || input_data_course[index + 1] == '../img/simulator/33.png'){
          $img[index].addEventListener('click', function(e){hazard_dialog(e)});
          $img[index].classList.add('hazard');
        }
        if (input_data_course[index + 1] == '../img/simulator/01.png'){
          $img[index].parentElement.style.backgroundColor = '#FFFFFF';
          $img[index].style.pointerEvents = 'none';
          start_tile++;
        }
        if (input_data_course[index + 1] == '../img/simulator/r1.png' || input_data_course[index + 1] == '../img/simulator/r2.png' || input_data_course[index + 1] == '../img/simulator/r3.png' || input_data_course[index + 1] == '../img/simulator/r4.png' || input_data_course[index + 1] == '../img/simulator/r5.png' || input_data_course[index + 1] == '../img/simulator/wt.png' || input_data_course[index + 1] == '../img/simulator/no.png'){
          $img[index].parentElement.style.backgroundColor = '#FFFFFF';
          $img[index].style.pointerEvents = 'none';
        }
        $img[index].dataset.turn = input_data_turn[index + 1];
        $img[index].style.transform = 'rotate(' + input_data_turn[index + 1] + 'deg)';
        $img[index].style.border = input_data_border[index + 1];
        if (input_data_border[index + 1] == 'solid 1px #663366' || input_data_border[index + 1] == 'solid 1px #CC3366'){
          $img[index].addEventListener('click', function(e){hazard_dialog(e)});
          $img[index].classList.add('hazard');
        }
        //チェックマーカー
        if(input_data_check[index + 1] == 1){
          check_marker++;
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
          newObstacle.dataset.cleared = "0";
          newObstacle.addEventListener('click', function(e){hazard_dialog(e)});
          $img[index].parentElement.appendChild(newObstacle);
          $img[index].dataset.obstacle = 1;
        }
        //バンプ
        if(input_data_bump1[index + 1] != 0){
          newBump = document.createElement("img");
          newBump.src = "../img/simulator/bu.png";
          newBump.className = "bump";
          newBump.dataset.cleared = "0";
          newBump.addEventListener('click', function(e){hazard_dialog(e)});
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
          newBump.dataset.cleared = "0";
          newBump.addEventListener('click', function(e){hazard_dialog(e)});
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
          newBump.dataset.cleared = "0";
          newBump.addEventListener('click', function(e){hazard_dialog(e)});
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
          newBump.dataset.cleared = "0";
          newBump.addEventListener('click', function(e){hazard_dialog(e)});
          bump_data = input_data_bump4[index + 1].split('a');
          newBump.setAttribute("style", "left: " + bump_data[0] + "px; top: " + bump_data[1] + "px; transform: rotate(" + bump_data[2] + "deg)");
          $img[index].parentElement.appendChild(newBump);
          $img[index].dataset.bump4 = input_data_bump4[index + 1];
          bump_data = null;
          newBump = null;
        }
      };
      if(window.innerWidth < 920){
        less_920();
      }
      document.getElementById('input_file').value = '';
      $guide.textContent = 'プロジェクトを読み込みました';
      setTimeout(nomal_guide, 2000);
      if (start_tile == 0){
        window.alert('スタートタイルがありません。スタートタイルがあるプロジェクトを読み込んでください。')
        window.location.reload();
      } else if (start_tile == 1){} else {
        window.alert('スタートタイルが多すぎます。スタートタイルは1つしか置けません。')
        window.location.reload();
      }
      if (check_marker == 0){
        window.alert('チェックマーカーがありません。タイルを右クリックしてチェックマーカーを配置してから得点計算を行ってください。')
      }
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
            document.getElementById('overlay').className = "active";
            document.getElementById('league').className = "active";
            document.getElementById('league_nrl').onclick = function () {
              input_data_show.push('nrl');
              document.getElementById('overlay').className = "";
              document.getElementById('league').className = "";
              all_clear();
              import_project();
            }
            document.getElementById('league_wrl').onclick = function () {
              window.alert('この得点計算ツールはNRL専用です。WRL得点計算をご利用ください。ページを再読み込みします。');
              window.location.reload();
            }
          } else {
            if(what_browser == "Safari"){
              window.alert('このファイルはメジャーバージョン2以前のソフトウェアによって作成されたものか、このソフトウェア以外で作られたCSVファイルです。バージョンが古い場合、最新版に変換してから利用してください。ページを再読み込みします。')
            } else {
              window.alert('このファイルはメジャーバージョン2以前のソフトウェアによって作成されたものです。最新版に変換してから利用してください。ページを再読み込みします。')
            }
            window.location.reload();
          }
        }
      }else{
        window.alert('拡張子は.rrlしか対応していません。')
      }
    });

    //再開
    $start_tools[1].addEventListener('click', () => {
      document.getElementById('overlay').className = "";
      document.getElementById('start').className = "";
    });

    //競技詳細
    $tools[2].addEventListener('click', () => {
      document.getElementById('overlay').className = "active";
      document.getElementById('statistics').className = "active";
    });
    document.getElementById('statistics_close').addEventListener('click', () => {
    document.getElementById('overlay').className = "";
    document.getElementById('statistics').className = "";
    });

    //プリント
    function print() {
      $tools[3].addEventListener('click', ()=> {
        window.alert('PDFとして印刷するにはプリンターを「PDFとして保存」にしてください。印刷するときはレイアウトを「横」にしてください。');
        window.print();
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
    }

    //6×8タイル
    $tools[4].addEventListener('click', ()=> {
      tile(0);
      $guide.textContent = '6×8タイルに切り替えました';
      setTimeout(nomal_guide, 2000);
    });

    //4×9タイル
    $tools[5].addEventListener('click', ()=> {
      tile(2);
      $guide.textContent = '4×9タイルに切り替えました。このモードでは被災者ゾーンの自動入力機能は使えません。';
      setTimeout(nomal_guide, 2000);
    });

    //3×12タイル
    $tools[6].addEventListener('click', ()=> {
      tile(4);
      $guide.textContent = '3×12タイルに切り替えました。このモードでは被災者ゾーンの自動入力機能は使えません。';
      setTimeout(nomal_guide, 2000);
    });

    //得点一覧
    $tools[7].addEventListener('click', () => {
      document.getElementById('overlay').className = "active";
      document.getElementById('rule').className = "active";
    });
    document.getElementById('rule_close').addEventListener('click', () => {
    document.getElementById('overlay').className = "";
    document.getElementById('rule').className = "";
    });

    //ヘルプ
    $tools[8].addEventListener('click', ()=> {
      window.open('help.html')
    });
    $start_tools[2].addEventListener('click', ()=> {
      window.open('help.html')
    });
    //ヘルプ(F1キー)
    window.addEventListener("keydown", function(e){
      if (e.key == "F1") {
        e.preventDefault();
        window.open('help.html')
      }
    });


    //右クリックメニュー
    function contextmenu_show (e){
      $contextmenu.style.display = "block";
      //topとbottomの決定(もし下のスペースがなければメニューを上にずらす)
      if (window.innerHeight - e.pageY < 186) {
        $contextmenu.style.top = "auto";
        $contextmenu.style.bottom = "10px";
      } else {
        $contextmenu.style.top = e.pageY+"px";
        $contextmenu.style.bottom = "auto";
      }
      //rightとleftの決定(もし右のスペースがなければメニューを左にずらす)
      if (window.innerWidth - e.pageX < 225) {
        $contextmenu.style.right = (window.innerWidth - e.pageX) + "px";
        $contextmenu.style.left = "auto";
      } else {
        $contextmenu.style.left = e.pageX+"px";
        $contextmenu.style.right = "auto";
      }
      //チェックマーカー
      document.getElementById('contextmenu_stop').textContent = e.target.dataset.stopped;
      if(e.target.dataset.check == 1){
        $contextmenu_title[0].className = "contextmenu-title";
        $contextmenu_title[1].className = "contextmenu-title_active";
        $contextmenu_title[1].onclick = function() {
          e.target.nextElementSibling.remove();
          e.target.dataset.check = 0;
        };
        $contextmenu_title[0].onclick = null;
      } else {
        $contextmenu_title[0].className = "contextmenu-title_active";
        $contextmenu_title[1].className = "contextmenu-title";
        $contextmenu_title[0].onclick = function() {
          newCheckMarker = document.createElement("div");
          newCheckMarker.className = "check-marker";
          e.target.parentElement.appendChild(newCheckMarker);
          e.target.dataset.check = 1;
        };
        $contextmenu_title[1].onclick = null;
      }
      //通過の取り消し
      if (e.target.dataset.passed == 0) {
        $contextmenu_title[2].className = "contextmenu-title";
        $contextmenu_title[2].onclick = null;
      } else {
        $contextmenu_title[2].className = "contextmenu-title_active";
        $contextmenu_title[2].onclick = function () {
          e.target.parentElement.style.backgroundColor = '';
          e.target.dataset.passed = '0';
        }
      }
      //競技進行の停止
      $contextmenu_title[3].onclick = function() {
        if (document.getElementById("timer_start").hasAttribute('disabled')){
        } else {
          window.alert('先に競技を開始してください。')
        }
        e.target.dataset.stopped = Number(e.target.dataset.stopped) + 1;
        e.target.parentElement.style.backgroundColor = '#FFCCCC';
        e.target.dataset.passed ='0';
        stop_count++;
        document.getElementById('stop_count').textContent = stop_count;
      };
      if (e.target.dataset.stopped == 0) {
        $contextmenu_title[4].className = "contextmenu-title";
        $contextmenu_title[4].onclick = null;
      } else {
        $contextmenu_title[4].className = "contextmenu-title_active";
        $contextmenu_title[4].onclick = function () {
          e.target.dataset.stopped = Number(e.target.dataset.stopped) - 1;
          stop_count--;
          document.getElementById('stop_count').textContent = stop_count;
          if (e.target.dataset.stopped == 0){
            e.target.parentElement.style.backgroundColor = '';
          }
        }
      }
    }
    let count_tap = 0;
    let contextmenu_showed = 0;
    for (let index = 0; index < imgLen; index++) {
      secondOrFirst = null;
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
      },{passive:true})
      $img[index].addEventListener('touchend', () => {
        clearInterval(long_tap_timer);
        count_tap = 0;
        contextmenu_showed = 0;
      });
    }

    //右クリックメニュー・ハザードダイアログ非表示
    document.body.addEventListener('click',function (){
      $contextmenu.style.display = "none";
      if(hazard_show == 1){
        hazard_show = 0;
      } else {
        document.getElementById('hazard_out').style.display = "none";
      }
    });


    //ウィンドウサイズ変更時
    function less_920(){
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

    function more_920(){
      for (let index = 0; index < imgLen; index++) {
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

  })();