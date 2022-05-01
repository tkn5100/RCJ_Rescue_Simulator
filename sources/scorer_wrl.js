(()=>{
    const $doc = document;
    const $guide = $doc.getElementById('guidetext');
    const $img = $doc.getElementsByClassName('image');
    const imgLen = $img.length;
    const $tools = $doc.getElementsByClassName('tools');
    const $start_tools = $doc.getElementsByClassName('start_tools');
    const $line_tools = $doc.getElementsByClassName('line_tools');
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
    let stop_count_all = 0;
    let passed_tiles = 0;
    //以下競技詳細用
    let nowSection = 1; //の区間1,2,…の判定。
    let newSectionTag = null;
    let cleared_bumps= 0;
    let cleared_obstacles = 0;
    let cleared_gaps = 0;
    let cleared_slopes = 0;
    let cleared_crossings = 0;
    let first_floor = [];
    let second_floor = [];
    let final_score = '';
    // 以下ライントレース関連
    let route = [];
    let newRouteCounter = null;
    let newStopCounter = null;
    // 以下避難ゾーン関連
    let multiplier = [];
    let multiply_section = 0; //乗数をいじる区間
    let multiply_all = 1;
    let num_of_living_victims = 0;
    let evacuation_point = null;
    let rescue_kit = null;
    let rescue_kit_set = 0;

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

    let few = '';
    function round(value){
      few = '';
      value = Math.round(value*1000) + '';
      few = ('000' + value.slice(-3)).slice(-3);
      return Number(value.slice(0,-3) + '.' + few)
    }

    function nomal_guide() {
      $guide.textContent = 'チェックマーカーはいつでも追加できます。';
    };

    //得点
    function get_points(num) {
      score = score + num;
      document.getElementById('score').innerHTML = score + '<span id="added_score">+' + num + '</span>';
      setTimeout(delete_points_guide, 2000);
      $guide.textContent = num + '点を獲得しました';
      setTimeout(nomal_guide, 2000);
    }
    function lose_points(num) {
      score = score - num;
      document.getElementById('score').innerHTML = score + '<span id="added_score">-' + num + '</span>';
      setTimeout(delete_points_guide, 2000);
      $guide.textContent = num + '点を取り消しました';
      setTimeout(nomal_guide, 2000);
    }
    function delete_points_guide (){
      document.getElementById('score').innerHTML = score;
    }
    function multiply_points() {
      for (let index = 0; index < multiplier.length; index++){
        multiply_all = multiply_all * multiplier[index][1];
      }
      score = round(score * multiply_all)
      document.getElementById('score').innerHTML = score;
      final_score = final_score + multiply_all + ' = ' + score + '点'
      document.getElementById('statistics_score').textContent = final_score
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
      document.getElementById("timer_start").style.backgroundColor = "#888888";
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
      document.getElementById("timer_stop").style.backgroundColor = "#888888";
      document.getElementsByClassName('button_hinan')[0].disabled = true;
      document.getElementsByClassName('button_hinan')[0].style.backgroundColor = "#888888";
      document.getElementsByClassName('button_hinan')[1].disabled = true;
      document.getElementsByClassName('button_hinan')[1].style.backgroundColor = "#888888";
      document.getElementsByClassName('button_hinan')[2].disabled = true;
      document.getElementsByClassName('button_hinan')[2].style.backgroundColor = "#888888";
      for (let index = 0; index < $line_tools.length; index++) {
        $line_tools[index].style.pointerEvents = 'none';
      }
      for (let index = 1; index < imgLen; index++) {
        $img[index].style.pointerEvents = 'none';
      }
      $guide.textContent = '競技を終了しました。コートの編集はロックされています。新しく競技を開始するには再読み込みしてください。';
    });


    let not_default = 0; //1になれば通常タイルではない。
    function tile_now(element){
      //初期化
      $line_tools[0].style.display = "none";
      $line_tools[1].style.display = "none";
      $line_tools[2].style.display = "none";
      $line_tools[3].style.display = "none";
      $line_tools[4].style.display = "none";
      $line_tools[5].style.display = "none";
      $line_tools[6].style.display = "none";
      $line_tools[7].style.display = "none";
      $line_tools[8].style.display = "none";
      $line_tools[9].style.display = "none";
      $line_tools[10].style.display = "none";
      $line_tools[11].style.display = "none";
      $line_tools[12].style.display = "none";
      $line_tools[13].style.display = "none";
      $line_tools[14].style.display = "none";
      $line_tools[15].style.display = "none";
      $line_tools[16].style.display = "none";
      $line_tools[17].style.display = "none";
      $line_tools[18].style.display = "none";
      $line_tools[19].style.display = "none";
      $line_tools[20].style.display = "none";
      $line_tools[21].style.display = "none";
      if(document.querySelector('#tile_now_img > img').dataset.check == 1){
        document.querySelector('#tile_now_img > img').nextElementSibling.remove();
        document.querySelector('#tile_now_img > img').dataset.check = 0;
      } else if(document.querySelector('#tile_now_img > img').dataset.obstacle == 1){
        document.querySelector('#tile_now_img > img').nextElementSibling.remove();
        document.querySelector('#tile_now_img > img').dataset.obstacle = 0;
      } else if(document.querySelector('#tile_now_img > img').dataset.bump1 != 0){
        document.querySelector('#tile_now_img > img').nextElementSibling.remove();
        document.querySelector('#tile_now_img > img').dataset.bump1 = 0;
        if(document.querySelector('#tile_now_img > img').dataset.bump2 != 0){
          document.querySelector('#tile_now_img > img').nextElementSibling.remove();
          document.querySelector('#tile_now_img > img').dataset.bump2 = 0;
          if(document.querySelector('#tile_now_img > img').dataset.bump3 != 0){
            document.querySelector('#tile_now_img > img').nextElementSibling.remove();
            document.querySelector('#tile_now_img > img').dataset.bump3 = 0;
            if(document.querySelector('#tile_now_img > img').dataset.bump4 != 0){
              document.querySelector('#tile_now_img > img').nextElementSibling.remove();
              document.querySelector('#tile_now_img > img').dataset.bump4 = 0;
            }
          }
        }
      }
      document.getElementById('tile_now_score').textContent = 0;
      //初期化終わり
      element.style.boxShadow = '0 0 15px #C2EEFF';
      document.getElementById('tile_now_stopped').textContent = 'このタイルでの競技進行の停止:' + element.dataset.stopped + '回';
      document.querySelector('#tile_now_img > img').src = element.src;
      document.querySelector('#tile_now_img > img').style.transform = 'rotate(' + element.dataset.turn + 'deg)';
      if(Number(element.dataset.number) >= 1 && Number(element.dataset.number) <= 48){
        tile(0);
      } else if(Number(element.dataset.number) >= 49 && Number(element.dataset.number) <= 96){
        tile(1);
      } else if(Number(element.dataset.number) >= 97 && Number(element.dataset.number) <= 132){
        tile(2);
      } else if(Number(element.dataset.number) >= 133 && Number(element.dataset.number) <= 168){
        tile(3);
      } else if(Number(element.dataset.number) >= 169 && Number(element.dataset.number) <= 204){
        tile(4);
      } else if(Number(element.dataset.number) >= 205 && Number(element.dataset.number) <= 240){
        tile(5);
      }
      if(element.dataset.check == 1){
        not_default = 1;
        //チェックマーカー
        newCheckMarker = document.createElement("div");
        newCheckMarker.className = "check-marker";
        document.querySelector('#tile_now_img > img').parentElement.appendChild(newCheckMarker);
        document.querySelector('#tile_now_img > img').dataset.check = 1;
        document.getElementById('tile_now_name').textContent = 'チェックタイル';
        document.querySelector('#tile_now_img > img').style.boxShadow = '0 0 5px #FFD700';
        if (stop_count == '0'){
          document.getElementById('tile_now_score').textContent = (passed_tiles + 1) * 5;
        } else if (stop_count == '1'){
          document.getElementById('tile_now_score').textContent = (passed_tiles + 1) * 3;
        } else if (stop_count == '2'){
          document.getElementById('tile_now_score').textContent = (passed_tiles + 1) * 1;
        } else {
          document.getElementById('tile_now_score').textContent = 0;
        }
        document.getElementById('tile_now_status').textContent = '';
      }
      if(element.dataset.obstacle == 1){
        not_default = 1;
        //障害物
        newObstacle = document.createElement("img");
        newObstacle.src = "../img/simulator/ob.svg";
        newObstacle.className = "obstacle";
        document.querySelector('#tile_now_img > img').parentElement.appendChild(newObstacle);
        document.querySelector('#tile_now_img > img').dataset.obstacle = 1;
        document.querySelector('#tile_now_img > img').style.boxShadow = '0 0 5px #C2EEFF';
        document.getElementById('tile_now_name').textContent = '通常のタイル';
        document.getElementById('tile_now_score').textContent = Number(document.getElementById('tile_now_score').textContent) + 15;
        document.getElementById('tile_now_status').textContent = '';
        if (element.nextElementSibling.dataset.cleared == "0"){
          document.getElementById('tile_now_status').textContent = 'これからクリア';
          $line_tools[4].style.display = "block";
        } else {
          document.getElementById('tile_now_status').textContent = 'クリア済み';
          $line_tools[5].style.display = "block";
          document.querySelector('#tile_now_img > img').nextElementSibling.classList.add('cleared');
        }
      }
      if(element.dataset.bump1 != 0){
        not_default = 1;
        //バンプ
        newBump = document.createElement("img");
        newBump.src = "../img/simulator/bu.png";
        newBump.className = "bump";
        bump_data = element.dataset.bump1.split('a');
        newBump.setAttribute("style", "left: " + bump_data[0] + "px; top: " + bump_data[1] + "px; transform: rotate(" + bump_data[2] + "deg)");
        document.querySelector('#tile_now_img > img').parentElement.appendChild(newBump);
        document.querySelector('#tile_now_img > img').dataset.bump1 = element.dataset.bump1;
        document.getElementById('tile_now_name').textContent = '通常のタイル';
        document.querySelector('#tile_now_img > img').style.boxShadow = '0 0 5px #C2EEFF';
        document.getElementById('tile_now_score').textContent = Number(document.getElementById('tile_now_score').textContent) + 5;
        document.getElementById('tile_now_status').textContent = '';
        if (element.nextElementSibling.dataset.cleared == "0"){
          $line_tools[6].style.display = "block";
        } else {
          $line_tools[7].style.display = "block";
          document.querySelector('#tile_now_img > img').nextElementSibling.classList.add('cleared');
        }
        bump_data = null;
        newBump = null;
        if(element.dataset.bump2 != 0){
          newBump = document.createElement("img");
          newBump.src = "../img/simulator/bu.png";
          newBump.className = "bump";
          bump_data = element.dataset.bump2.split('a');
          newBump.setAttribute("style", "left: " + bump_data[0] + "px; top: " + bump_data[1] + "px; transform: rotate(" + bump_data[2] + "deg)");
          document.querySelector('#tile_now_img > img').parentElement.appendChild(newBump);
          document.querySelector('#tile_now_img > img').dataset.bump2 = element.dataset.bump2;
          document.getElementById('tile_now_score').textContent = Number(document.getElementById('tile_now_score').textContent) + 5;
          if (element.nextElementSibling.nextElementSibling.dataset.cleared == "0"){
            $line_tools[8].style.display = "block";
          } else {
            $line_tools[9].style.display = "block";
            document.querySelector('#tile_now_img > img').nextElementSibling.nextElementSibling.classList.add('cleared');
          }
          bump_data = null;
          newBump = null;
          if(element.dataset.bump3 != 0){
            newBump = document.createElement("img");
            newBump.src = "../img/simulator/bu.png";
            newBump.className = "bump";
            bump_data = element.dataset.bump3.split('a');
            newBump.setAttribute("style", "left: " + bump_data[0] + "px; top: " + bump_data[1] + "px; transform: rotate(" + bump_data[2] + "deg)");
            document.querySelector('#tile_now_img > img').parentElement.appendChild(newBump);
            document.querySelector('#tile_now_img > img').dataset.bump3 = element.dataset.bump3;
            document.getElementById('tile_now_score').textContent = Number(document.getElementById('tile_now_score').textContent) + 5;
            if (element.nextElementSibling.nextElementSibling.nextElementSibling.dataset.cleared == "0"){
              $line_tools[10].style.display = "block";
            } else {
              $line_tools[11].style.display = "block";
              document.querySelector('#tile_now_img > img').nextElementSibling.nextElementSibling.nextElementSibling.classList.add('cleared');
            }
            bump_data = null;
            newBump = null;
            if(element.dataset.bump4 != 0){
              newBump = document.createElement("img");
              newBump.src = "../img/simulator/bu.png";
              newBump.className = "bump";
              bump_data = element.dataset.bump4.split('a');
              newBump.setAttribute("style", "left: " + bump_data[0] + "px; top: " + bump_data[1] + "px; transform: rotate(" + bump_data[2] + "deg)");
              document.querySelector('#tile_now_img > img').parentElement.appendChild(newBump);
              document.querySelector('#tile_now_img > img').dataset.bump4 = element.dataset.bump4;
              document.getElementById('tile_now_score').textContent = Number(document.getElementById('tile_now_score').textContent) + 5;
              if (element.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.dataset.cleared == "0"){
                $line_tools[12].style.display = "block";
              } else {
                $line_tools[13].style.display = "block";
                document.querySelector('#tile_now_img > img').nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.classList.add('cleared');
              }
              bump_data = null;
              newBump = null;
            }
          }
        }
      }
      if (element.src.slice(-6) == '03.png') {
        not_default = 1;
        //ギャップ1個
        document.getElementById('tile_now_name').textContent = 'ギャップ(1)';
        document.getElementById('tile_now_score').textContent = Number(document.getElementById('tile_now_score').textContent) + 10;
        document.querySelector('#tile_now_img > img').style.boxShadow = '0 0 5px #FFD700';
        if (element.dataset.cleared == "0"){
          document.getElementById('tile_now_status').textContent = 'これからクリア';
          $line_tools[0].style.display = "block";
        } else {
          document.querySelector('#tile_now_img > img').style.boxShadow = '0 0 5px #888888';
          document.getElementById('tile_now_status').textContent = 'クリア済み';
          $line_tools[1].style.display = "block";
        }
      } else if (element.src.slice(-6) == '04.png' || element.src.slice(-6) == '33.png') {
        not_default = 1;
        //ギャップ2個
        document.getElementById('tile_now_name').textContent = 'ギャップ(2)';
        document.getElementById('tile_now_score').textContent = Number(document.getElementById('tile_now_score').textContent) + 20;
        document.querySelector('#tile_now_img > img').style.boxShadow = '0 0 5px #FFD700';
        if (element.dataset.cleared == "0"){
          document.getElementById('tile_now_status').textContent = 'これからクリア';
          $line_tools[0].style.display = "block";
          $line_tools[2].style.display = "block";
        } else if (element.dataset.cleared == '1'){
          document.getElementById('tile_now_status').textContent = '1つクリア済み';
          $line_tools[1].style.display = "block";
          $line_tools[2].style.display = "block";
        } else if (element.dataset.cleared == '2'){
          document.querySelector('#tile_now_img > img').style.boxShadow = '0 0 5px #888888';
          document.getElementById('tile_now_status').textContent = 'すべてクリア済み';
          $line_tools[1].style.display = "block";
          $line_tools[3].style.display = "block";
        }
      }
      if (element.style.border == "1px solid rgb(102, 51, 102)" || element.style.border == "1px solid rgb(204, 51, 102)") {
        not_default = 1;
        //傾斜路
        document.getElementById('tile_now_name').textContent = '傾斜路';
        document.getElementById('tile_now_score').textContent = Number(document.getElementById('tile_now_score').textContent) + 10;
        if (element.dataset.cleared == "0"){
          document.querySelector('#tile_now_img > img').style.boxShadow = '0 0 5px #FFD700';
          document.getElementById('tile_now_status').textContent = 'これからクリア・スキップ';
          $line_tools[14].style.display = "block";
          $line_tools[16].style.display = "block";
        } else if (element.dataset.cleared == "skipped"){
          document.querySelector('#tile_now_img > img').style.boxShadow = '0 0 5px #888888';
          document.getElementById('tile_now_status').textContent = 'スキップ済み';
          $line_tools[17].style.display = "block";
        } else {
          document.querySelector('#tile_now_img > img').style.boxShadow = '0 0 5px #888888';
          document.getElementById('tile_now_status').textContent = 'クリア済み';
          $line_tools[15].style.display = "block";
        }
      }
      if (element.src.slice(-6) == 'aa.png' || element.src.slice(-6) == 'ab.png' || element.src.slice(-6) == 'ac.png' || element.src.slice(-6) == 'ad.png' || element.src.slice(-6) == 'ae.png' || element.src.slice(-6) == 'af.png' || element.src.slice(-6) == 'ag.png' || element.src.slice(-6) == 'ah.png') {
        not_default = 1;
        //交差点1個
        document.getElementById('tile_now_name').textContent = '交差点(1)';
        document.getElementById('tile_now_score').textContent = Number(document.getElementById('tile_now_score').textContent) + 10;
        document.querySelector('#tile_now_img > img').style.boxShadow = '0 0 5px #FFD700';
        if (element.dataset.cleared== "0"){
          document.getElementById('tile_now_status').textContent = 'これからクリア';
          $line_tools[18].style.display = "block";
        } else if(element.dataset.cleared== "1"){
          document.querySelector('#tile_now_img > img').style.boxShadow = '0 0 5px #FFD700';
          document.getElementById('tile_now_status').textContent = 'クリア済み';
          $line_tools[19].style.display = "block";
        }
      } else if (element.src.slice(-6) == 'ai.png' || element.src.slice(-6) == 'aj.png' || element.src.slice(-6) == 'ak.png' || element.src.slice(-6) == 'al.png'){
        not_default = 1;
        //交差点2個
        document.getElementById('tile_now_name').textContent = '交差点(2)';
        document.getElementById('tile_now_score').textContent = Number(document.getElementById('tile_now_score').textContent) + 20;
        document.querySelector('#tile_now_img > img').style.boxShadow = '0 0 5px #FFD700';
        if (element.dataset.cleared == "0"){
          document.getElementById('tile_now_status').textContent = 'これからクリア';
          $line_tools[18].style.display = "block";
          $line_tools[20].style.display = "block";
        } else if (element.dataset.cleared == '1'){
          document.getElementById('tile_now_status').textContent = '1つクリア済み';
          $line_tools[19].style.display = "block";
          $line_tools[20].style.display = "block";
        } else if (element.dataset.cleared == '2'){
          document.querySelector('#tile_now_img > img').style.boxShadow = '0 0 5px #888888';
          document.getElementById('tile_now_status').textContent = 'すべてクリア済み';
          $line_tools[19].style.display = "block";
          $line_tools[21].style.display = "block";
        }
      }
      if (not_default == 0){
        //通常のタイル
        document.getElementById('tile_now_name').textContent = '通常のタイル';
        document.querySelector('#tile_now_img > img').style.boxShadow = '0 0 5px #C2EEFF';
        document.getElementById('tile_now_status').textContent = '';
      }
      not_default = 0;
    }

    let count_index = 0;
    let redo_pass = 0; //直前にしか戻れないようにする。チェックポイントを超えて戻ることを防ぐため。
    function count_tile(){
      tile_now(route[0]);
      $line_tools[22].addEventListener('click', () => {
        if (document.getElementById("timer_start").hasAttribute('disabled')){
          redo_pass = 0;
          route[count_index].style.backgroundColor = "#C2EEFF";
          route[count_index].style.boxShadow = "none";
          route[count_index].dataset.pass = Number(route[count_index].dataset.pass) - 1;
          if(count_index > 0){
            route[count_index - 1].dataset.cleared = "0";
          }
          passed_tiles++;
          if (count_index < route.length - 1){
            count_index++;
            route[count_index].style.boxShadow = "0 0 10px #8EF1FF";
            tile_now(route[count_index])
            //チェックマーカーがあったとき
            if (route[count_index - 1].dataset.check == 1){
              for (let index = 0; index < count_index; index++) {
                if (route[index].style.backgroundColor == "rgb(194, 238, 255)"){
                  if (route[index].dataset.pass == 0){
                    route[index].style.backgroundColor = "#FFFFFF";
                    route[index].style.pointerEvents = 'none';
                  } else {
                    route[index].style.backgroundColor = "#EEEEEE";
                  }
                }
              }
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
              multiply_section = 1;
              document.getElementById('stop_count').textContent = '0';
            }
          } else{
            //チェックマーカーがあったとき
            if (route[count_index].dataset.check == 1){
              for (let index = 0; index < count_index + 1; index++) {
                if (route[index].style.backgroundColor == "rgb(194, 238, 255)"){
                  if (route[index].dataset.pass == 0){
                    route[index].style.backgroundColor = "#FFFFFF";
                    route[index].style.pointerEvents = 'none';
                  } else {
                    route[index].style.backgroundColor = "#EEEEEE";
                  }
                }
              }
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
            //脱出得点
            final_score = '(ライントレース ' + score + '点 + 脱出得点';
            if (60 - (5 * stop_count_all) <= 0){
              window.alert('今までの競技進行の停止総数が12回以上であるため得点はありません。')
              document.getElementById('statistics_clear').textContent = '脱出済み 0点(競技進行の停止総数が' + stop_count_all + '回であるため)';
            } else {
              get_points(60 - (5 * stop_count_all));
              final_score = final_score + (60 - (5 * stop_count_all)) + '点) × 乗数'
              document.getElementById('statistics_clear').textContent = '脱出済み 60 - 5 × ' + stop_count_all + ' = ' + (60 - (5 * stop_count_all)) + '点';
            }
            //最終タイルでは乗数をかける
            if(multiplier.length > 0){
              multiply_points();
            }
            //競技終了処理
            clearInterval(TimerID);
            document.getElementById("timer_stop").disabled = true;
            document.getElementById("timer_stop").style.backgroundColor = "#888888";
            document.getElementsByClassName('button_hinan')[0].disabled = true;
            document.getElementsByClassName('button_hinan')[0].style.backgroundColor = "#888888";
            document.getElementsByClassName('button_hinan')[1].disabled = true;
            document.getElementsByClassName('button_hinan')[1].style.backgroundColor = "#888888";
            document.getElementsByClassName('button_hinan')[2].disabled = true;
            document.getElementsByClassName('button_hinan')[2].style.backgroundColor = "#888888";
            for (let index = 0; index < $line_tools.length; index++) {
              $line_tools[index].style.pointerEvents = 'none';
            }
            for (let index = 1; index < imgLen; index++) {
              $img[index].style.pointerEvents = 'none';
              $img[index].style.cursor = 'default';
            }
            window.alert('最終タイルに到達したため、競技を終了しました。')
            $guide.textContent = 'コートの編集はロックされています。新しく競技を開始するには再読み込みしてください。';
          }
        } else {
          window.alert('先に競技を開始してください。')
        }
      });
      $line_tools[23].addEventListener('click', () => {
        if (document.getElementById("timer_start").hasAttribute('disabled')){
          if (redo_pass == 1) {
            window.alert('取り消すことができるのは直前の操作のみです。')
          } else if (route[count_index - 1].dataset.check == 1){
            window.alert('チェックポイントを通過したため戻れません。')
          } else if (count_index > 0){
            route[count_index].style.boxShadow = "";
            count_index--;
            route[count_index].dataset.pass = Number(route[count_index].dataset.pass) + 1;
            route[count_index].style.backgroundColor = "#EEEEEE";
            route[count_index].style.boxShadow = "0 0 10px #8EF1FF";
            tile_now(route[count_index])
            redo_pass = 1;
          } else {
            window.alert('この操作は無効です。')
          }
        } else {
          window.alert('先に競技を開始してください。')
        }
      });
      $line_tools[24].addEventListener('click', () => {
        if (document.getElementById("timer_start").hasAttribute('disabled')){
          if (route[count_index].dataset.stopped == 0){
            route[count_index].dataset.stopped = "1";
            newStopCounter = document.createElement("div");
            newStopCounter.id = "stop-" + count_index;
            newStopCounter.className = "stop_counter";
            newStopCounter.textContent = "1";
            route[count_index].parentElement.appendChild(newStopCounter);
            stop_count++;
            stop_count_all++;
            document.getElementById('stop_count').textContent = stop_count;
          } else {
            route[count_index].dataset.stopped = Number(route[count_index].dataset.stopped) + 1;
            document.getElementById('stop-' + count_index).textContent = route[count_index].dataset.stopped;
            stop_count++;
            stop_count_all++;
            document.getElementById('stop_count').textContent = stop_count;
          }
          if(multiplier.length > 0 && multiply_section == 0){
            for (let index = 0; index < multiplier.length; index++){
              if(evacuation_point == 1 && multiplier[index][1] - 0.025 >= 1){
                multiplier[index][1] = round(multiplier[index][1] - 0.025);
              } else if(evacuation_point == 2 && multiplier[index][1] - 0.05 >= 1){
                multiplier[index][1] = round(multiplier[index][1] - 0.05);
              }
            }
            show_multiplier();
          }
          tile_now(route[count_index]);
        } else {
          window.alert('先に競技を開始してください。')
        }
      });
      $line_tools[25].addEventListener('click', () => {
        if (document.getElementById("timer_start").hasAttribute('disabled')){
          if (route[count_index].dataset.stopped == 0){
            window.alert('このタイルでは競技進行の停止をしたことがありません。')
          } else {
            route[count_index].dataset.stopped = Number(route[count_index].dataset.stopped) - 1;
            if(route[count_index].dataset.stopped == 0){
              document.getElementById('stop-' + count_index).remove();
            } else {
              document.getElementById('stop-' + count_index).textContent = route[count_index].dataset.stopped;
            }
            stop_count--;
            stop_count_all--;
            document.getElementById('stop_count').textContent = stop_count;
          }
          if(multiplier.length > 0 && multiply_section == 0){
            for (let index = 0; index < multiplier.length; index++){
              if(evacuation_point == 1){
                multiplier[index][1] = round(multiplier[index][1] + 0.025);
              } else {
                multiplier[index][1] = round(multiplier[index][1] + 0.05);
              }
            }
            show_multiplier();
          }
          tile_now(route[count_index]);
        } else {
          window.alert('先に競技を開始してください。')
        }
      });

      //ギャップ
      $line_tools[0].addEventListener('click', () => {
        if (document.getElementById("timer_start").hasAttribute('disabled')){
          get_points(10);
          route[count_index].dataset.cleared = "1";
          cleared_gaps++;
          tile_now(route[count_index]);
        } else {
          window.alert('先に競技を開始してください。')
        }
      });
      $line_tools[1].addEventListener('click', () => {
        if (document.getElementById("timer_start").hasAttribute('disabled')){
          if (document.getElementById('tile_now_name').textContent == 'ギャップ(1)'){
            route[count_index].dataset.cleared = "0";
            lose_points(10);
            cleared_gaps--;
          } else if (document.getElementById('tile_now_name').textContent == 'ギャップ(2)'){
            if (route[count_index].dataset.cleared == "2"){
              window.alert('先に2つ目のギャップのクリアを取り消してください。')
            } else {
              route[count_index].dataset.cleared = "0";
              lose_points(10);
              cleared_gaps--;
            }
          }
          tile_now(route[count_index]);
        } else {
          window.alert('先に競技を開始してください。')
        }
      });
      $line_tools[2].addEventListener('click', () => {
        if (document.getElementById("timer_start").hasAttribute('disabled')){
          if (route[count_index].dataset.cleared == "0"){
            window.alert('先に1つ目のギャップをクリアしてください。')
          } else {
            route[count_index].dataset.cleared = "2";
            get_points(10);
            cleared_gaps++;
          }
          tile_now(route[count_index]);
        } else {
          window.alert('先に競技を開始してください。')
        }
      });
      $line_tools[3].addEventListener('click', () => {
        if (document.getElementById("timer_start").hasAttribute('disabled')){
            lose_points(10);
            route[count_index].dataset.cleared = "1";
            cleared_gaps--;
          tile_now(route[count_index]);
        } else {
          window.alert('先に競技を開始してください。')
        }
      });
      //障害物
      $line_tools[4].addEventListener('click', () => {
        if (document.getElementById("timer_start").hasAttribute('disabled')){
          get_points(15);
          route[count_index].nextElementSibling.dataset.cleared = "1";
          route[count_index].nextElementSibling.classList.add('cleared');
          cleared_obstacles++;
          tile_now(route[count_index]);
        } else {
          window.alert('先に競技を開始してください。')
        }
      });
      $line_tools[5].addEventListener('click', () => {
        if (document.getElementById("timer_start").hasAttribute('disabled')){
          lose_points(15);
          route[count_index].nextElementSibling.dataset.cleared = "0";
          route[count_index].nextElementSibling.classList.remove('cleared');
          cleared_obstacles--;
          tile_now(route[count_index]);
        } else {
          window.alert('先に競技を開始してください。')
        }
      });
      //バンプ
      $line_tools[6].addEventListener('click', () => {
        if (document.getElementById("timer_start").hasAttribute('disabled')){
          get_points(5);
          route[count_index].nextElementSibling.dataset.cleared = "1";
          route[count_index].nextElementSibling.classList.add('cleared');
          cleared_bumps++;
          tile_now(route[count_index]);
        } else {
          window.alert('先に競技を開始してください。')
        }
      });
      $line_tools[7].addEventListener('click', () => {
        if (document.getElementById("timer_start").hasAttribute('disabled')){
          lose_points(5);
          route[count_index].nextElementSibling.dataset.cleared = "0";
          route[count_index].nextElementSibling.classList.remove('cleared');
          cleared_bumps--;
          tile_now(route[count_index]);
        } else {
          window.alert('先に競技を開始してください。')
        }
      });
      $line_tools[8].addEventListener('click', () => {
        if (document.getElementById("timer_start").hasAttribute('disabled')){
          route[count_index].nextElementSibling.nextElementSibling.dataset.cleared = "1";
          route[count_index].nextElementSibling.nextElementSibling.classList.add('cleared');
          get_points(5);
          cleared_bumps++;
          tile_now(route[count_index]);
        } else {
          window.alert('先に競技を開始してください。')
        }
      });
      $line_tools[9].addEventListener('click', () => {
        if (document.getElementById("timer_start").hasAttribute('disabled')){
          lose_points(5);
          route[count_index].nextElementSibling.nextElementSibling.dataset.cleared = "0";
          route[count_index].nextElementSibling.nextElementSibling.classList.remove('cleared');
          cleared_bumps--;
          tile_now(route[count_index]);
        } else {
          window.alert('先に競技を開始してください。')
        }
      });
      $line_tools[10].addEventListener('click', () => {
        if (document.getElementById("timer_start").hasAttribute('disabled')){
          route[count_index].nextElementSibling.nextElementSibling.nextElementSibling.dataset.cleared = "1";
          route[count_index].nextElementSibling.nextElementSibling.nextElementSibling.classList.add('cleared');
          get_points(5);
          cleared_bumps++;
          tile_now(route[count_index]);
        } else {
          window.alert('先に競技を開始してください。')
        }
      });
      $line_tools[11].addEventListener('click', () => {
        if (document.getElementById("timer_start").hasAttribute('disabled')){
          lose_points(5);
          route[count_index].nextElementSibling.nextElementSibling.nextElementSibling.dataset.cleared = "0";
          route[count_index].nextElementSibling.nextElementSibling.nextElementSibling.classList.remove('cleared');
          cleared_bumps--;
          tile_now(route[count_index]);
        } else {
          window.alert('先に競技を開始してください。')
        }
      });
      $line_tools[12].addEventListener('click', () => {
        if (document.getElementById("timer_start").hasAttribute('disabled')){
          route[count_index].nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.dataset.cleared = "1";
          route[count_index].nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.classList.add('cleared');
          get_points(5);
          cleared_bumps++;
          tile_now(route[count_index]);
        } else {
          window.alert('先に競技を開始してください。')
        }
      });
      $line_tools[13].addEventListener('click', () => {
        if (document.getElementById("timer_start").hasAttribute('disabled')){
          lose_points(5);
          route[count_index].nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.dataset.cleared = "0";
          route[count_index].nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.classList.remove('cleared');
          cleared_bumps--;
          tile_now(route[count_index]);
        } else {
          window.alert('先に競技を開始してください。')
        }
      });
      //傾斜路
      $line_tools[14].addEventListener('click', () => {
        if (document.getElementById("timer_start").hasAttribute('disabled')){
          route[count_index].dataset.cleared = "1";
          get_points(10);
          cleared_slopes++;
          tile_now(route[count_index]);
        } else {
          window.alert('先に競技を開始してください。')
        }
      });
      $line_tools[15].addEventListener('click', () => {
        if (document.getElementById("timer_start").hasAttribute('disabled')){
          route[count_index].dataset.cleared = "0";
          lose_points(10);
          cleared_slopes--;
          tile_now(route[count_index]);
        } else {
          window.alert('先に競技を開始してください。')
        }
      });
      $line_tools[16].addEventListener('click', () => {
        if (document.getElementById("timer_start").hasAttribute('disabled')){
          route[count_index].dataset.cleared = "skipped";
          tile_now(route[count_index]);
        } else {
          window.alert('先に競技を開始してください。')
        }
      });
      $line_tools[17].addEventListener('click', () => {
        if (document.getElementById("timer_start").hasAttribute('disabled')){
          route[count_index].dataset.cleared = "0";
          tile_now(route[count_index]);
        } else {
          window.alert('先に競技を開始してください。')
        }
      });
      //交差点
      $line_tools[18].addEventListener('click', () => {
        if (document.getElementById("timer_start").hasAttribute('disabled')){
          get_points(10);
          route[count_index].dataset.cleared = "1";
          cleared_crossings++;
          tile_now(route[count_index]);
        } else {
          window.alert('先に競技を開始してください。')
        }
      });
      $line_tools[19].addEventListener('click', () => {
        if (document.getElementById("timer_start").hasAttribute('disabled')){
          if (document.getElementById('tile_now_name').textContent == '交差点(1)'){
            route[count_index].dataset.cleared = "0";
            lose_points(10);
            cleared_crossings--;
          } else if (document.getElementById('tile_now_name').textContent == '交差点(2)'){
            if (route[count_index].dataset.cleared == "2"){
              window.alert('先に2つ目の交差点のクリアを取り消してください。')
            } else {
              route[count_index].dataset.cleared = "0";
              lose_points(10);
              cleared_crossings--;
            }
          }
          tile_now(route[count_index]);
        } else {
          window.alert('先に競技を開始してください。')
        }
      });
      $line_tools[20].addEventListener('click', () => {
        if (document.getElementById("timer_start").hasAttribute('disabled')){
          if (route[count_index].dataset.cleared == "0"){
            window.alert('先に1つ目の交差点をクリアしてください。')
          } else {
            route[count_index].dataset.cleared = "2";
            get_points(10);
            cleared_crossings++;
          }
          tile_now(route[count_index]);
        } else {
          window.alert('先に競技を開始してください。')
        }
      });
      $line_tools[21].addEventListener('click', () => {
        if (document.getElementById("timer_start").hasAttribute('disabled')){
            lose_points(10);
            route[count_index].dataset.cleared = "1";
            cleared_crossings--;
          tile_now(route[count_index]);
        } else {
          window.alert('先に競技を開始してください。')
        }
      });
    }


    //避難ゾーン
    let show_multiplier_innerhtml = '現在獲得した乗数:<br>';
    function show_multiplier(){
      for (let index = 0; index < multiplier.length; index++){
        if (multiplier[index][0] == 'living'){
          show_multiplier_innerhtml = show_multiplier_innerhtml + '生きている被災者: x' + multiplier[index][1] + '<br>';
        } else if (multiplier[index][0] == 'dead'){
          show_multiplier_innerhtml = show_multiplier_innerhtml + '死んでいる被災者: x' + multiplier[index][1] + '<br>';
        } else if (multiplier[index][0] == 'rescue_kit'){
          show_multiplier_innerhtml = show_multiplier_innerhtml + 'レスキューキット: x' + multiplier[index][1] + '<br>';
        }
      }
      document.getElementById('show_multiplier').innerHTML = show_multiplier_innerhtml;
      show_multiplier_innerhtml = '現在獲得した乗数:<br>';
    }

    document.getElementsByClassName('button_hinan')[0].addEventListener('click', () => {
      if (document.getElementById("timer_start").hasAttribute('disabled')){
        if(evacuation_point == 1 && stop_count <= 16){
          multiplier.push(['living', round(1.4 - (stop_count * 0.025))]);
        } else if(evacuation_point == 2 && stop_count <= 8){
          multiplier.push(['living', round(1.4 - (stop_count * 0.05))]);
        } else {
          multiplier.push(['living', 1]);
        }
        show_multiplier();
      } else {
        window.alert('先に競技を開始してください。')
      }
    });
    document.getElementsByClassName('button_hinan')[1].addEventListener('click', () => {
      if (document.getElementById("timer_start").hasAttribute('disabled')){
        if (multiplier.length < 2){
          multiplier.push(['dead', 1]);
        } else {
          for (let index = 0; index < multiplier.length; index++){
            if (multiplier[index][0] == 'living'){
              num_of_living_victims++;
            }
          }
          if(num_of_living_victims < 2){
            multiplier.push(['dead', 1]);
          } else {
            if(evacuation_point == 1 && stop_count <= 16){
              multiplier.push(['dead', round(1.4 - (stop_count * 0.025))]);
            } else if(evacuation_point == 2 && stop_count <= 8){
              multiplier.push(['dead', round(1.4 - (stop_count * 0.05))]);
            } else {
              multiplier.push(['dead', 1]);
            }
          }
        }
        num_of_living_victims = 0;
        show_multiplier();
      } else {
        window.alert('先に競技を開始してください。')
      }
    });
    document.getElementsByClassName('button_hinan')[2].addEventListener('click', () => {
      if (document.getElementById("timer_start").hasAttribute('disabled')){
        if (rescue_kit_set == 0){
          if (evacuation_point == 1 && rescue_kit == 1){
            if(evacuation_point == 1 && stop_count <= 4){
              multiplier.push(['rescue_kit', round(1.1 - (stop_count * 0.025))]);
            } else if(evacuation_point == 2 && stop_count <= 2){
              multiplier.push(['rescue_kit', round(1.1 - (stop_count * 0.05))]);
            } else {
              multiplier.push(['rescue_kit', 1]);
            }
          } else if (evacuation_point == 1 && rescue_kit == 2){
            if(evacuation_point == 1 && stop_count <= 12){
              multiplier.push(['rescue_kit', round(1.3 - (stop_count * 0.025))]);
            } else if(evacuation_point == 2 && stop_count <= 6){
              multiplier.push(['rescue_kit', round(1.3 - (stop_count * 0.05))]);
            } else {
              multiplier.push(['rescue_kit', 1]);
            }
          } else if (evacuation_point == 2 && rescue_kit == 1){
            if(evacuation_point == 1 && stop_count <= 8){
              multiplier.push(['rescue_kit', round(1.2 - (stop_count * 0.025))]);
            } else if(evacuation_point == 2 && stop_count <= 4){
              multiplier.push(['rescue_kit', round(1.2 - (stop_count * 0.05))]);
            } else {
              multiplier.push(['rescue_kit', 1]);
            }
          } else if (evacuation_point == 2 && rescue_kit == 2){
            if(evacuation_point == 1 && stop_count <= 24){
              multiplier.push(['rescue_kit', round(1.6 - (stop_count * 0.025))]);
            } else if(evacuation_point == 2 && stop_count <= 12){
              multiplier.push(['rescue_kit', round(1.6 - (stop_count * 0.05))]);
            } else {
              multiplier.push(['rescue_kit', 1]);
            }
          }
          rescue_kit_set = 1;
        } else {
          window.alert('レスキューキットはすでに置かれています。')
        }
        show_multiplier();
      } else {
        window.alert('先に競技を開始してください。')
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
            first_floor.push(["../img/simulator/" + $table[arg - 1].firstElementChild.children[index].children[i].firstElementChild.src.slice(-6), $table[arg - 1].firstElementChild.children[index].children[i].firstElementChild.dataset.turn, $table[arg - 1].firstElementChild.children[index].children[i].firstElementChild.dataset.pass])
          }
        }
        for (let index = 0; index < $table[arg].firstElementChild.children.length; index++){
          for (let i = 0; i < $table[arg].firstElementChild.children[index].children.length; i++){
            if ($table[arg].firstElementChild.children[index].children[i].firstElementChild.style.backgroundColor == 'rgb(204, 204, 204)' || $table[arg].firstElementChild.children[index].children[i].firstElementChild.src.slice(-6) == 'no.png'){
              $table[arg].firstElementChild.children[index].children[i].firstElementChild.src = first_floor[index2][0];
              $table[arg].firstElementChild.children[index].children[i].firstElementChild.style.transform = "rotate(" + first_floor[index2][1] + "deg)";
              $table[arg].firstElementChild.children[index].children[i].firstElementChild.style.backgroundColor = "#CCCCCC";
            }
            index2++;
          }
        }
      } else {
        for (let index = 0; index < imgLen; index++) {
          $img[index].style.backgroundImage = "none";
        }
        for (let index = 0; index < $table[arg + 1].firstElementChild.children.length; index++){
          for (let i = 0; i < $table[arg + 1].firstElementChild.children[index].children.length; i++){
            if($table[arg + 1].firstElementChild.children[index].children[i].firstElementChild.style.backgroundColor == 'rgb(204, 204, 204)' || $table[arg + 1].firstElementChild.children[index].children[i].firstElementChild.src.slice(-6) == 'no.png'){
              second_floor.push(0);
            } else {
              second_floor.push(1);
            }
          }
        }
        for (let index = 0; index < $table[arg].firstElementChild.children.length; index++){
          for (let i = 0; i < $table[arg].firstElementChild.children[index].children.length; i++){
            if(second_floor[index2] == 1){
              $table[arg].firstElementChild.children[index].children[i].firstElementChild.style.backgroundImage = "url(../img/simulator/po.png)";
              $table[arg].firstElementChild.children[index].children[i].firstElementChild.style.backgroundSize = "100%";
            } else {}
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

    //走行順序の決定
    function route_decide(){
      //↓最低限の読み込み↓
      for (let index = 0; index < imgLen; index++) {
        //コート
        tile(input_data_show[1]);
        //NRL・WRL
        if(input_data_show[2] == 'wrl'){
        } else {
          window.alert('この得点計算ツールはWRL専用です。NRL向けの得点計算をご利用ください。');
          break;
        }
        //タイル
        $img[index].src = input_data_course[index + 1];
        if (input_data_course[index + 1] == '../img/simulator/03.png' || input_data_course[index + 1] == '../img/simulator/04.png' || input_data_course[index + 1] == '../img/simulator/33.png'){
          //十字路
          $img[index].style.backgroundColor = '#EEEEEE';
        } else if (input_data_course[index + 1] == '../img/simulator/01.png'){
          //スタートタイル
          start_tile++;
          $img[index].style.backgroundColor = '#FFFFFF';
          $img[index].style.pointerEvents = 'none';
        } else if (input_data_course[index + 1] == '../img/simulator/r1.png' || input_data_course[index + 1] == '../img/simulator/r2.png' || input_data_course[index + 1] == '../img/simulator/r3.png' || input_data_course[index + 1] == '../img/simulator/r4.png' || input_data_course[index + 1] == '../img/simulator/r5.png' || input_data_course[index + 1] == '../img/simulator/r6.png' || input_data_course[index + 1] == '../img/simulator/r7.png' || input_data_course[index + 1] == '../img/simulator/r8.png' || input_data_course[index + 1] == '../img/simulator/wt.png'){
          //避難ゾーンタイル
          $img[index].style.backgroundColor = '#FFFFFF';
          $img[index].style.pointerEvents = 'none';
        } else if (input_data_course[index + 1] == '../img/simulator/no.png'){
          //未作成
          $img[index].style.pointerEvents = 'none';
        } else {
          //その他
          $img[index].style.backgroundColor = '#EEEEEE';
        }
        $img[index].dataset.turn = input_data_turn[index + 1];
        $img[index].style.transform = 'rotate(' + input_data_turn[index + 1] + 'deg)';
        $img[index].style.border = input_data_border[index + 1];
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
          $img[index].parentElement.appendChild(newObstacle);
          $img[index].dataset.obstacle = 1;
        }
        //バンプ
        if(input_data_bump1[index + 1] != 0){
          newBump = document.createElement("img");
          newBump.src = "../img/simulator/bu.png";
          newBump.className = "bump";
          newBump.dataset.cleared = "0";
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
          bump_data = input_data_bump4[index + 1].split('a');
          newBump.setAttribute("style", "left: " + bump_data[0] + "px; top: " + bump_data[1] + "px; transform: rotate(" + bump_data[2] + "deg)");
          $img[index].parentElement.appendChild(newBump);
          $img[index].dataset.bump4 = input_data_bump4[index + 1];
          bump_data = null;
          newBump = null;
        }
        if(window.innerWidth < 920){
          less_920();
        }
      }
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

      document.getElementsByClassName('menu_start')[0].style.display = 'block';
      document.getElementsByClassName('menu')[0].style.display = 'none';
      for (let index = 0; index < imgLen; index++) {
        $img[index].addEventListener('click', (e) => {
          if(route.at(-1) == e.target){
            window.alert('同じタイルを連続で通過することはできません。')
          } else {
            route.push(e.target)
            e.target.style.backgroundColor = '#C2EEFF';
            if (e.target.dataset.pass == 0){
              e.target.dataset.pass = "1";
              newRouteCounter = document.createElement("div");
              newRouteCounter.className = "route_counter";
              newRouteCounter.textContent = "1";
              e.target.parentElement.appendChild(newRouteCounter);
            } else {
              e.target.dataset.pass = Number(e.target.dataset.pass) + 1;
              if(input_data_check[index + 1] == 1){
                e.target.nextElementSibling.nextElementSibling.textContent = e.target.dataset.pass;
              } else if(input_data_obstacle[index + 1] == 1){
                e.target.nextElementSibling.nextElementSibling.textContent = e.target.dataset.pass;
              } else if(input_data_bump1[index + 1] != 0){
                e.target.nextElementSibling.nextElementSibling.textContent = e.target.dataset.pass;
              } else if(input_data_bump2[index + 1] != 0){
                e.target.nextElementSibling.nextElementSibling.nextElementSibling.textContent = e.target.dataset.pass;
              } else if(input_data_bump3[index + 1] != 0){
                e.target.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.textContent = e.target.dataset.pass;
              } else if(input_data_bump4[index + 1] != 0){
                e.target.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.textContent = e.target.dataset.pass;
              } else {
                e.target.nextElementSibling.textContent = e.target.dataset.pass;
              }
            }
          }
        });
      }
      document.getElementById('route_finish').addEventListener('click', () => {
        if(window.confirm('走行順序を決定してもよろしいですか?')){
          if (route.length < 8) {
            window.alert('コートには最低8枚のタイルが必要です。')
          } else {
            for (let index = 0; index < imgLen; index++) {
              $img[index].onclick = function(){};
              if ($img[index].dataset.pass != 0){
                $img[index].style.backgroundColor = '#EEEEEE';
                if(input_data_check[index + 1] == 1){
                  $img[index].nextElementSibling.nextElementSibling.remove();
                } else if(input_data_obstacle[index + 1] == 1){
                  $img[index].nextElementSibling.nextElementSibling.remove();
                } else if(input_data_bump4[index + 1] != 0){
                  $img[index].nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.remove();
                } else if(input_data_bump3[index + 1] != 0){
                  $img[index].nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.remove();
                } else if(input_data_bump2[index + 1] != 0){
                  $img[index].nextElementSibling.nextElementSibling.nextElementSibling.remove();
                } else if(input_data_bump1[index + 1] != 0){
                  $img[index].nextElementSibling.nextElementSibling.remove();
                } else {
                  $img[index].nextElementSibling.remove();
                }
              }
            }
            document.getElementsByClassName('menu_start')[0].style.display = 'none';
            document.getElementsByClassName('menu')[0].style.display = 'flex';
            import_project();
            contextmenu();
            count_tile();
            document.getElementById('level').className = "active";
            document.getElementById('overlay').className = "active";
            document.getElementById('level_decide').addEventListener('click', () => {
              if(document.getElementsByName('evacuation_point')[0].checked){
                evacuation_point = 1;
              } else {
                evacuation_point = 2;
              }
              if(document.getElementsByName('rescue_kit')[0].checked){
                rescue_kit = 1;
              } else {
                rescue_kit = 2;
              }
              document.getElementById('level').className = "";
              document.getElementById('overlay').className = "";
            });
          }
        }
      });
    }

    //プロジェクトの読み込み
    function import_project() {
      for (let index = 0; index < imgLen; index++) {
        if (input_data_course[index + 1] == '../img/simulator/03.png' || input_data_course[index + 1] == '../img/simulator/04.png' || input_data_course[index + 1] == '../img/simulator/33.png'){
          //十字路
          $img[index].classList.add('hazard');
        }
        $img[index].dataset.turn = input_data_turn[index + 1];
        $img[index].style.transform = 'rotate(' + input_data_turn[index + 1] + 'deg)';
        $img[index].style.border = input_data_border[index + 1];
        if (input_data_border[index + 1] == 'solid 1px #663366' || input_data_border[index + 1] == 'solid 1px #CC3366'){
          $img[index].classList.add('hazard');
        }
        //障害物
        if(input_data_obstacle[index + 1] == 1){
          $img[index].nextElementSibling.addEventListener('click', function(e){hazard_dialog(e)});
        }
        //バンプ
        if(input_data_bump1[index + 1] != 0){
          $img[index].nextElementSibling.addEventListener('click', function(e){hazard_dialog(e)});
        }
        if(input_data_bump2[index + 1] != 0){
          $img[index].nextElementSibling.nextElementSibling.addEventListener('click', function(e){hazard_dialog(e)});
        }
        if(input_data_bump3[index + 1] != 0){
          $img[index].nextElementSibling.nextElementSibling.nextElementSibling.addEventListener('click', function(e){hazard_dialog(e)});
        }
        if(input_data_bump4[index + 1] != 0){
          $img[index].nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.addEventListener('click', function(e){hazard_dialog(e)});
        }
      };
      document.getElementById('input_file').value = '';
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
          if (csv_arrays[0] == "v4.0.0," || csv_arrays[0] == "v4.1.0," || csv_arrays[0] == "v4.1.1," || csv_arrays[0] == "v4.2.0," || csv_arrays[0] == "v4.2.1," || csv_arrays[0] == "v4.2.2," || csv_arrays[0] == "v4.3.0," || csv_arrays[0] == "v4.3.1," || csv_arrays[0] == "v4.4.0,") {
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
            route_decide();
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
            document.getElementById('league_wrl').onclick = function () {
              input_data_show.push('nrl');
              document.getElementById('overlay').className = "";
              document.getElementById('league').className = "";
              input_data_show[2] = 'wrl';
              all_clear();
              route_decide();
            }
            document.getElementById('league_nrl').onclick = function () {
              window.alert('この得点計算ツールはWRL専用です。NRL得点計算をご利用ください。ページを再読み込みします。');
              window.location.reload();
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

    //再開
    $start_tools[1].addEventListener('click', () => {
      document.getElementById('overlay').className = "";
      document.getElementById('start').className = "";
    });

    //競技詳細
    $tools[3].addEventListener('click', () => {
      if (document.getElementsByClassName('menu')[0].style.display == 'none'){
        window.alert('この機能は走行順序を決定するとご利用いただけます。');
      } else {
        if(document.getElementById("timer_stop").disabled == true){}else{
          document.getElementById('statistics_score').textContent = score + '点';
        }
        document.getElementById('statistics_bump').textContent = '5点 × ' + cleared_bumps + '個 =  ' + cleared_bumps * 5 + '点';
        document.getElementById('statistics_obstacle').textContent = '15点 × ' + cleared_obstacles + '個 =  ' + cleared_obstacles * 15 + '点';
        document.getElementById('statistics_slope').textContent = '10点 × ' + cleared_slopes + '個 =  ' + cleared_slopes * 10 + '点';
        document.getElementById('statistics_gap').textContent = '10点 × ' + cleared_gaps + '個 =  ' + cleared_gaps * 10 + '点';
        document.getElementById('overlay').className = "active";
        document.getElementById('statistics').className = "active";
      }
    });
    document.getElementById('statistics_close').addEventListener('click', () => {
      document.getElementById('overlay').className = "";
      document.getElementById('statistics').className = "";
    });

    //プリント
    function print() {
      $tools[4].addEventListener('click', ()=> {
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
    $tools[5].addEventListener('click', ()=> {
      tile(0);
      $guide.textContent = '6×8タイルに切り替えました';
      setTimeout(nomal_guide, 2000);
    });

    //4×9タイル
    $tools[6].addEventListener('click', ()=> {
      tile(2);
      $guide.textContent = '4×9タイルに切り替えました。このモードでは被災者ゾーンの自動入力機能は使えません。';
      setTimeout(nomal_guide, 2000);
    });

    //3×12タイル
    $tools[7].addEventListener('click', ()=> {
      tile(4);
      $guide.textContent = '3×12タイルに切り替えました。このモードでは被災者ゾーンの自動入力機能は使えません。';
      setTimeout(nomal_guide, 2000);
    });

    //得点一覧
    $tools[8].addEventListener('click', () => {
      document.getElementById('overlay').className = "active";
      document.getElementById('rule').className = "active";
    });
    document.getElementById('rule_close').addEventListener('click', () => {
    document.getElementById('overlay').className = "";
    document.getElementById('rule').className = "";
    });

    //ヘルプ
    $tools[9].addEventListener('click', ()=> {
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
      if (window.innerHeight - e.pageY < 80) {
        $contextmenu.style.top = "auto";
        $contextmenu.style.bottom = "10px";
      } else {
        $contextmenu.style.top = e.pageY+"px";
        $contextmenu.style.bottom = "auto";
      }
      //rightとleftの決定(もし右のスペースがなければメニューを左にずらす)
      if (window.innerWidth - e.pageX < 185) {
        $contextmenu.style.right = (window.innerWidth - e.pageX) + "px";
        $contextmenu.style.left = "auto";
      } else {
        $contextmenu.style.left = e.pageX+"px";
        $contextmenu.style.right = "auto";
      }
      //チェックマーカー
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
    }

    let count_tap = 0;
    let contextmenu_showed = 0;
    function contextmenu () {
      for (let index = 0; index < imgLen; index++) {
        secondOrFirst = null;
        $img[index].addEventListener('contextmenu', (e) => {
          e.preventDefault();
          contextmenu_show(e);
        });
        $img[index].addEventListener('touchstart', (e) => {
          long_tap_timer = setInterval(() => {
            count_tap++;
            if (count_tap > 10 && contextmenu_showed == 0){
              contextmenu_show(e.changedTouches[0]);
              contextmenu_showed = 1;
            }
          }, 100);
        })
        $img[index].addEventListener('touchend', () => {
          clearInterval(long_tap_timer);
          count_tap = 0;
          contextmenu_showed = 0;
        });
      }
      //右クリックメニュー非表示
      document.body.addEventListener('click',function (){
        $contextmenu.style.display = "none";
      });
    }


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