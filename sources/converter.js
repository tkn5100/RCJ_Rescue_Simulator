(()=>{
    //このプログラムのようなsetTimeoutの使い方はよくない。なおsetTimeoutを分散させている効果は全くない。
    //最新版への変換のみ実施するが、旧版から旧版への変換用関数もとっておく
  
    const $tools = document.getElementsByClassName('tools');
    const $arrow_line = document.getElementsByClassName('arrow_line');
    const $uploaded_file = document.getElementById('uploaded_file');
    const $upload_guide = document.querySelector('#upload > p');
    const $download_guide = document.querySelector('#download > p');
    let file = null;
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
    let output_data = null;


    function arrow_line(percent) {
      if(percent == 'reset'){
        for (let index = 0; index < 9; index++) {
          $arrow_line[index].src = '../img/converter/line.svg';
        }
        $arrow_line[9].src = '../img/converter/arrow.svg';
      } else if (percent == 100) {
        $arrow_line[9].src = '../img/converter/arrow_success.svg';
      } else {
        $arrow_line[(percent / 10) - 1].src = '../img/converter/line_success.svg';
      }
    }

    function output(file_name,version_before,version){
      //BOMを付与する（Excelでの文字化け対策）
      const bom = new Uint8Array([0xef, 0xbb, 0xbf]);
      //Blobでデータを作成する
      const blob = new Blob([bom, output_data], { type: "text/csv" });
      setTimeout(arrow_line, 750, 60)
      //BlobからオブジェクトURLを作成する
      const url = (window.URL || window.webkitURL).createObjectURL(blob);
      setTimeout(arrow_line, 875, 70)
      //ダウンロード用にリンクを作成する
      const download = document.createElement("a");
      setTimeout(arrow_line, 1000, 80)
      //リンク先に上記で生成したURLを指定する
      download.href = url;
      setTimeout(arrow_line, 1125 ,90)
      //download属性にファイル名を指定する
      download.download = file_name.slice(0, -4) + '_converted.rrl';
      setTimeout(arrow_line, 1250 ,100);
      //作成したリンクをクリックしてダウンロードを実行する
      setTimeout(() => {download.click();}, 1250)
      //createObjectURLで作成したオブジェクトURLを開放する
      setTimeout(() => {(window.URL || window.webkitURL).revokeObjectURL(url)}, 1500)
      setTimeout(() => {$upload_guide.innerHTML = version_before + '→' + version + '<br>変換完了';}, 1500)
      setTimeout(() => {$download_guide.style.color = '#000000';}, 1500)
      setTimeout(() => {document.querySelector('#download > img').src = '../img/converter/downloaded.svg';}, 1500)
    }

    //v1.x.x→v2.0.2
    function one_to_Two(file_name){
      $upload_guide.innerHTML = 'v1.3.3以前<br>お待ちください...';
      setTimeout(arrow_line, 125, 10)
      try{
        input_data_course = csv_arrays[0].split(',');
        input_data_course.unshift('');
        input_data_turn = csv_arrays[1].split(',');
        input_data_border = csv_arrays[2].split(',');
        input_data_check = csv_arrays[3].split(',');
        input_data_obstacle = csv_arrays[4].split(',');
        input_data_bump1 = csv_arrays[5].split(',');
      }catch (e){
        window.alert('エラー:データの読み込みに失敗しました。ファイルが破損している可能性があります。ページを再読み込みします。')
        window.location.reload();
      }
      for (let index = 1; index < input_data_bump1.length; index++) {
        if(input_data_bump1[index] != '0'){
          input_data_bump1[index] = '37a0a' + input_data_bump1[index]
        }
      }
      for (let index = 1; index < input_data_bump1.length; index++) {
        input_data_bump2.push('0');
        input_data_bump3.push('0');
        input_data_bump4.push('0');
      }
      setTimeout(arrow_line, 250, 20)
      output_data = [[],[],[],[],[],[],[],[],[],[]];
      output_data[0].push("v2.0.2")
      for (let index = 0; index < input_data_course.length; index++) {
        output_data[1].push(input_data_course[index]);
        output_data[2].push(input_data_turn[index]);
        output_data[3].push(input_data_border[index]);
        output_data[4].push(input_data_check[index]);
        output_data[5].push(input_data_obstacle[index]);
        output_data[6].push(input_data_bump1[index]);
        output_data[7].push(input_data_bump2[index]);
        output_data[8].push(input_data_bump3[index]);
        output_data[9].push(input_data_bump4[index]);
      };
      setTimeout(arrow_line, 375, 30)
      output_data[1].shift();
      output_data[2].shift();
      output_data[3].shift();
      output_data[4].shift();
      output_data[5].shift();
      output_data[6].shift();
      setTimeout(arrow_line, 500, 40)
      output_data[0].push('\n');
      output_data[1][output_data[1].length - 1] = '\n';
      output_data[2][output_data[2].length - 1] = '\n';
      output_data[3][output_data[3].length - 1] = '\n';
      output_data[4][output_data[4].length - 1] = '\n';
      output_data[5][output_data[5].length - 1] = '\n';
      output_data[6][output_data[6].length - 1] = '\n';
      output_data[7][output_data[7].length - 1] = '\n';
      output_data[8][output_data[8].length - 1] = '\n';
      setTimeout(arrow_line, 625, 50)
      //BOMを付与する（Excelでの文字化け対策）
      const bom = new Uint8Array([0xef, 0xbb, 0xbf]);
      //Blobでデータを作成する
      const blob = new Blob([bom, output_data], { type: "text/csv" });
      setTimeout(arrow_line, 750, 60)
      //BlobからオブジェクトURLを作成する
      const url = (window.URL || window.webkitURL).createObjectURL(blob);
      setTimeout(arrow_line, 875, 70)
      //ダウンロード用にリンクを作成する
      const download = document.createElement("a");
      setTimeout(arrow_line, 1000, 80)
      //リンク先に上記で生成したURLを指定する
      download.href = url;
      setTimeout(arrow_line, 1125 ,90)
      //download属性にファイル名を指定する
      download.download = file_name.slice(0, -4) + '_converted.rrl';
      setTimeout(arrow_line, 1250 ,100);
      //作成したリンクをクリックしてダウンロードを実行する
      setTimeout(() => {download.click();}, 1250)
      //createObjectURLで作成したオブジェクトURLを開放する
      setTimeout(() => {(window.URL || window.webkitURL).revokeObjectURL(url)}, 1500)
      setTimeout(() => {$upload_guide.innerHTML = 'v1.3.3以前→v2.0.2<br>変換完了';}, 1500)
      setTimeout(() => {$download_guide.style.color = '#000000';}, 1500)
      setTimeout(() => {document.querySelector('#download > img').src = '../img/converter/downloaded.svg';}, 1500)
    }

    //v1.x.x→v3.1.1
    function one_to_Three(file_name){
      $upload_guide.innerHTML = 'v1.3.3以前<br>お待ちください...';
      setTimeout(arrow_line, 125, 10)
      try{
        input_data_course = csv_arrays[0].split(',');
        input_data_course.unshift('');
        input_data_turn = csv_arrays[1].split(',');
        input_data_border = csv_arrays[2].split(',');
        input_data_check = csv_arrays[3].split(',');
        input_data_obstacle = csv_arrays[4].split(',');
        input_data_bump1 = csv_arrays[5].split(',');
      }catch (e){
        window.alert('エラー:データの読み込みに失敗しました。ファイルが破損している可能性があります。ページを再読み込みします。')
        window.location.reload();
      }
      for (let index = 1; index < input_data_course.length - 1; index++){
        input_data_course[index] = '../img/simulator/' + input_data_course[index].slice(-6);
      }
      for (let index = 1; index < input_data_bump1.length; index++) {
        if(input_data_bump1[index] != '0'){
          input_data_bump1[index] = '37a0a' + input_data_bump1[index]
        }
      }
      for (let index = 1; index < input_data_bump1.length; index++) {
        input_data_bump2.push('0');
        input_data_bump3.push('0');
        input_data_bump4.push('0');
      }
      setTimeout(arrow_line, 250, 20)
      output_data = [[],[],[],[],[],[],[],[],[],[],[]];
      output_data[0].push("v3.1.1")
      output_data[1].push(0);
      for (let index = 0; index < input_data_course.length; index++) {
        output_data[2].push(input_data_course[index]);
        output_data[3].push(input_data_turn[index]);
        output_data[4].push(input_data_border[index]);
        output_data[5].push(input_data_check[index]);
        output_data[6].push(input_data_obstacle[index]);
        output_data[7].push(input_data_bump1[index]);
      };
      for (let index = 0; index < input_data_bump2.length; index++) {
        output_data[8].push(input_data_bump2[index]);
        output_data[9].push(input_data_bump3[index]);
        output_data[10].push(input_data_bump4[index]);
      }
      setTimeout(arrow_line, 375, 30)
      output_data[2].shift();
      output_data[3].shift();
      output_data[4].shift();
      output_data[5].shift();
      output_data[6].shift();
      output_data[7].shift();
      setTimeout(arrow_line, 500, 40)
      output_data[0].push('\n');
      output_data[1].push('\n');
      output_data[2][output_data[2].length - 1] = '\n';
      output_data[3][output_data[3].length - 1] = '\n';
      output_data[4][output_data[4].length - 1] = '\n';
      output_data[5][output_data[5].length - 1] = '\n';
      output_data[6][output_data[6].length - 1] = '\n';
      output_data[7][output_data[7].length - 1] = '\n';
      output_data[8].push('\n');
      output_data[9].push('\n');
      setTimeout(arrow_line, 625, 50)
      //BOMを付与する（Excelでの文字化け対策）
      const bom = new Uint8Array([0xef, 0xbb, 0xbf]);
      //Blobでデータを作成する
      const blob = new Blob([bom, output_data], { type: "text/csv" });
      setTimeout(arrow_line, 750, 60)
      //BlobからオブジェクトURLを作成する
      const url = (window.URL || window.webkitURL).createObjectURL(blob);
      setTimeout(arrow_line, 875, 70)
      //ダウンロード用にリンクを作成する
      const download = document.createElement("a");
      setTimeout(arrow_line, 1000, 80)
      //リンク先に上記で生成したURLを指定する
      download.href = url;
      setTimeout(arrow_line, 1125 ,90)
      //download属性にファイル名を指定する
      download.download = file_name.slice(0, -4) + '_converted.rrl';
      setTimeout(arrow_line, 1250 ,100);
      //作成したリンクをクリックしてダウンロードを実行する
      setTimeout(() => {download.click();}, 1250)
      //createObjectURLで作成したオブジェクトURLを開放する
      setTimeout(() => {(window.URL || window.webkitURL).revokeObjectURL(url)}, 1500)
      setTimeout(() => {$upload_guide.innerHTML = 'v1.3.3以前→v3.1.1<br>変換完了';}, 1500)
      setTimeout(() => {$download_guide.style.color = '#000000';}, 1500)
      setTimeout(() => {document.querySelector('#download > img').src = '../img/converter/downloaded.svg';}, 1500)
    }

    //v1.x.x→v4.3.1
    function one_to_Four(file_name){
      $upload_guide.innerHTML = 'v1.3.3以前<br>お待ちください...';
      setTimeout(arrow_line, 125, 10)
      try{
        input_data_course = csv_arrays[0].split(',');
        input_data_course.unshift('');
        input_data_turn = csv_arrays[1].split(',');
        input_data_border = csv_arrays[2].split(',');
        input_data_check = csv_arrays[3].split(',');
        input_data_obstacle = csv_arrays[4].split(',');
        input_data_bump1 = csv_arrays[5].split(',');
      }catch (e){
        window.alert('エラー:データの読み込みに失敗しました。ファイルが破損している可能性があります。ページを再読み込みします。')
        window.location.reload();
      }
      for (let index = 1; index < input_data_course.length - 1; index++){
        input_data_course[index] = '../img/simulator/' + input_data_course[index].slice(-6);
      }
      for (let index = 1; index < input_data_bump1.length; index++) {
        if(input_data_bump1[index] != '0'){
          input_data_bump1[index] = '37a0a' + input_data_bump1[index]
        }
      }
      for (let index = 1; index < input_data_bump1.length; index++) {
        input_data_bump2.push('0');
        input_data_bump3.push('0');
        input_data_bump4.push('0');
      }
      setTimeout(arrow_line, 250, 20)
      output_data = [[],[],[],[],[],[],[],[],[],[],[]];
      output_data[0].push("v4.3.1")
      for (let index = 0; index < input_data_course.length; index++) {
        output_data[2].push(input_data_course[index]);
        output_data[3].push(input_data_turn[index]);
        output_data[4].push(input_data_border[index]);
        output_data[5].push(input_data_check[index]);
        output_data[6].push(input_data_obstacle[index]);
        output_data[7].push(input_data_bump1[index]);
      };
      for (let index = 0; index < input_data_bump2.length; index++) {
        output_data[8].push(input_data_bump2[index]);
        output_data[9].push(input_data_bump3[index]);
        output_data[10].push(input_data_bump4[index]);
      }
      setTimeout(arrow_line, 375, 30)
      output_data[2].shift();
      output_data[3].shift();
      output_data[4].shift();
      output_data[5].shift();
      output_data[6].shift();
      output_data[7].shift();
      setTimeout(arrow_line, 500, 40)
      output_data[0].push('\n');
      output_data[2][output_data[2].length - 1] = '\n';
      output_data[3][output_data[3].length - 1] = '\n';
      output_data[4][output_data[4].length - 1] = '\n';
      output_data[5][output_data[5].length - 1] = '\n';
      output_data[6][output_data[6].length - 1] = '\n';
      output_data[7][output_data[7].length - 1] = '\n';
      output_data[8].push('\n');
      output_data[9].push('\n');
      setTimeout(arrow_line, 625, 50)
      output_data[1].push(0);
      document.getElementById('overlay').className = "active";
      document.getElementById('league').className = "active";
      document.getElementById('league_decide').onclick = function () {
        if (document.getElementsByName('league2')[0].checked) {
          output_data[1].push('nrl');
          output_data[1].push('\n');
          document.getElementById('overlay').className = "";
          document.getElementById('league').className = "";
          output(file_name,csv_arrays[0].slice(0,6),'v4.3.1');
        } else {
          output_data[1].push('wrl');
          output_data[1].push('\n');
          document.getElementById('overlay').className = "";
          document.getElementById('league').className = "";
          output(file_name,csv_arrays[0].slice(0,6),'v4.3.1')
        }
      }
    }

    //v2.0.x→v2.0.2
    function two_to_Two(file_name){
      $upload_guide.innerHTML = csv_arrays[0].slice(0,6) + '<br>お待ちください...';
      setTimeout(arrow_line, 125, 10)
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
      setTimeout(arrow_line, 250, 20)
      output_data = [[],[],[],[],[],[],[],[],[],[]];
      output_data[0].push("v2.0.2")
      for (let index = 0; index < input_data_course.length; index++) {
        output_data[1].push(input_data_course[index]);
        output_data[2].push(input_data_turn[index]);
        output_data[3].push(input_data_border[index]);
        output_data[4].push(input_data_check[index]);
        output_data[5].push(input_data_obstacle[index]);
        output_data[6].push(input_data_bump1[index]);
        output_data[7].push(input_data_bump2[index]);
        output_data[8].push(input_data_bump3[index]);
        output_data[9].push(input_data_bump4[index]);
      };
      setTimeout(arrow_line, 375, 30)
      output_data[1].shift();
      output_data[2].shift();
      output_data[3].shift();
      output_data[4].shift();
      output_data[5].shift();
      output_data[6].shift();
      output_data[7].shift();
      output_data[8].shift();
      output_data[9].shift();
      setTimeout(arrow_line, 500, 40)
      output_data[0].push('\n');
      output_data[1][output_data[1].length - 1] = '\n';
      output_data[2][output_data[2].length - 1] = '\n';
      output_data[3][output_data[3].length - 1] = '\n';
      output_data[4][output_data[4].length - 1] = '\n';
      output_data[5][output_data[5].length - 1] = '\n';
      output_data[6][output_data[6].length - 1] = '\n';
      output_data[7][output_data[7].length - 1] = '\n';
      output_data[8][output_data[8].length - 1] = '\n';
      setTimeout(arrow_line, 625, 50)
      //BOMを付与する（Excelでの文字化け対策）
      const bom = new Uint8Array([0xef, 0xbb, 0xbf]);
      //Blobでデータを作成する
      const blob = new Blob([bom, output_data], { type: "text/csv" });
      setTimeout(arrow_line, 750, 60)
      //BlobからオブジェクトURLを作成する
      const url = (window.URL || window.webkitURL).createObjectURL(blob);
      setTimeout(arrow_line, 875, 70)
      //ダウンロード用にリンクを作成する
      const download = document.createElement("a");
      setTimeout(arrow_line, 1000, 80)
      //リンク先に上記で生成したURLを指定する
      download.href = url;
      setTimeout(arrow_line, 1125 ,90)
      //download属性にファイル名を指定する
      download.download = file_name.slice(0, -4) + '_converted.rrl';
      setTimeout(arrow_line, 1250 ,100);
      //作成したリンクをクリックしてダウンロードを実行する
      setTimeout(() => {download.click();}, 1250)
      //createObjectURLで作成したオブジェクトURLを開放する
      setTimeout(() => {(window.URL || window.webkitURL).revokeObjectURL(url)}, 1500)
      setTimeout(() => {$upload_guide.innerHTML = csv_arrays[0].slice(0,6) + '→v2.0.2<br>変換完了';}, 1500)
      setTimeout(() => {$download_guide.style.color = '#000000';}, 1500)
      setTimeout(() => {document.querySelector('#download > img').src = '../img/converter/downloaded.svg';}, 1500)
    }

    //v2.0.x→v3.1.1
    function two_to_Three(file_name){
      $upload_guide.innerHTML = csv_arrays[0].slice(0,6) + '<br>お待ちください...';
      setTimeout(arrow_line, 125, 10)
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
      for (let index = 1; index < input_data_course.length - 1; index++){
        input_data_course[index] = '../img/simulator/' + input_data_course[index].slice(-6);
      }
      setTimeout(arrow_line, 250, 20)
      output_data = [[],[],[],[],[],[],[],[],[],[],[]];
      output_data[0].push("v3.1.1")
      output_data[1].push(0);
      for (let index = 0; index < input_data_course.length; index++) {
        output_data[2].push(input_data_course[index]);
        output_data[3].push(input_data_turn[index]);
        output_data[4].push(input_data_border[index]);
        output_data[5].push(input_data_check[index]);
        output_data[6].push(input_data_obstacle[index]);
        output_data[7].push(input_data_bump1[index]);
        output_data[8].push(input_data_bump2[index]);
        output_data[9].push(input_data_bump3[index]);
        output_data[10].push(input_data_bump4[index]);
      };
      setTimeout(arrow_line, 375, 30)
      output_data[2].shift();
      output_data[3].shift();
      output_data[4].shift();
      output_data[5].shift();
      output_data[6].shift();
      output_data[7].shift();
      output_data[8].shift();
      output_data[9].shift();
      output_data[10].shift();
      setTimeout(arrow_line, 500, 40)
      output_data[0].push('\n');
      output_data[1].push('\n');
      output_data[2][output_data[2].length - 1] = '\n';
      output_data[3][output_data[3].length - 1] = '\n';
      output_data[4][output_data[4].length - 1] = '\n';
      output_data[5][output_data[5].length - 1] = '\n';
      output_data[6][output_data[6].length - 1] = '\n';
      output_data[7][output_data[7].length - 1] = '\n';
      output_data[8][output_data[8].length - 1] = '\n';
      output_data[9][output_data[9].length - 1] = '\n';
      output_data[10].pop();
      setTimeout(arrow_line, 625, 50)
      //BOMを付与する（Excelでの文字化け対策）
      const bom = new Uint8Array([0xef, 0xbb, 0xbf]);
      //Blobでデータを作成する
      const blob = new Blob([bom, output_data], { type: "text/csv" });
      setTimeout(arrow_line, 750, 60)
      //BlobからオブジェクトURLを作成する
      const url = (window.URL || window.webkitURL).createObjectURL(blob);
      setTimeout(arrow_line, 875, 70)
      //ダウンロード用にリンクを作成する
      const download = document.createElement("a");
      setTimeout(arrow_line, 1000, 80)
      //リンク先に上記で生成したURLを指定する
      download.href = url;
      setTimeout(arrow_line, 1125 ,90)
      //download属性にファイル名を指定する
      download.download = file_name.slice(0, -4) + '_converted.rrl';
      setTimeout(arrow_line, 1250 ,100);
      //作成したリンクをクリックしてダウンロードを実行する
      setTimeout(() => {download.click();}, 1250)
      //createObjectURLで作成したオブジェクトURLを開放する
      setTimeout(() => {(window.URL || window.webkitURL).revokeObjectURL(url)}, 1500)
      setTimeout(() => {$upload_guide.innerHTML = csv_arrays[0].slice(0,6) + '→v3.1.1<br>変換完了';}, 1500)
      setTimeout(() => {$download_guide.style.color = '#000000';}, 1500)
      setTimeout(() => {document.querySelector('#download > img').src = '../img/converter/downloaded.svg';}, 1500)
    }

    //v2.0.x→v4.3.1
    function two_to_Four(file_name){
      $upload_guide.innerHTML = csv_arrays[0].slice(0,6) + '<br>お待ちください...';
      setTimeout(arrow_line, 125, 10)
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
      for (let index = 1; index < input_data_course.length - 1; index++){
        input_data_course[index] = '../img/simulator/' + input_data_course[index].slice(-6);
      }
      setTimeout(arrow_line, 250, 20)
      output_data = [[],[],[],[],[],[],[],[],[],[],[]];
      output_data[0].push("v4.3.1")
      output_data[1].push(0);
      for (let index = 0; index < input_data_course.length; index++) {
        output_data[2].push(input_data_course[index]);
        output_data[3].push(input_data_turn[index]);
        output_data[4].push(input_data_border[index]);
        output_data[5].push(input_data_check[index]);
        output_data[6].push(input_data_obstacle[index]);
        output_data[7].push(input_data_bump1[index]);
        output_data[8].push(input_data_bump2[index]);
        output_data[9].push(input_data_bump3[index]);
        output_data[10].push(input_data_bump4[index]);
      };
      setTimeout(arrow_line, 375, 30)
      output_data[2].shift();
      output_data[3].shift();
      output_data[4].shift();
      output_data[5].shift();
      output_data[6].shift();
      output_data[7].shift();
      output_data[8].shift();
      output_data[9].shift();
      output_data[10].shift();
      setTimeout(arrow_line, 500, 40)
      output_data[0].push('\n');
      output_data[2][output_data[2].length - 1] = '\n';
      output_data[3][output_data[3].length - 1] = '\n';
      output_data[4][output_data[4].length - 1] = '\n';
      output_data[5][output_data[5].length - 1] = '\n';
      output_data[6][output_data[6].length - 1] = '\n';
      output_data[7][output_data[7].length - 1] = '\n';
      output_data[8][output_data[8].length - 1] = '\n';
      output_data[9][output_data[9].length - 1] = '\n';
      output_data[10].pop();
      setTimeout(arrow_line, 625, 50)
      document.getElementById('overlay').className = "active";
      document.getElementById('league').className = "active";
      document.getElementById('league_decide').onclick = function () {
        if (document.getElementsByName('league2')[0].checked) {
          output_data[1].push('nrl');
          output_data[1].push('\n');
          document.getElementById('overlay').className = "";
          document.getElementById('league').className = "";
          output(file_name,csv_arrays[0].slice(0,6),'v4.3.1');
        } else {
          output_data[1].push('wrl');
          output_data[1].push('\n');
          document.getElementById('overlay').className = "";
          document.getElementById('league').className = "";
          output(file_name,csv_arrays[0].slice(0,6),'v4.3.1')
        }
      }
    }

    //v3.x.x→v3.1.1
    function three_to_Three(file_name){
      $upload_guide.innerHTML = csv_arrays[0].slice(0,6) + '<br>お待ちください...';
      setTimeout(arrow_line, 125, 10)
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
      setTimeout(arrow_line, 250, 20)
      output_data = [[],[],[],[],[],[],[],[],[],[],[]];
      output_data[0].push("v3.1.1")
      output_data[1].push(input_data_show[0])
      for (let index = 0; index < input_data_course.length; index++) {
        output_data[2].push(input_data_course[index]);
        output_data[3].push(input_data_turn[index]);
        output_data[4].push(input_data_border[index]);
        output_data[5].push(input_data_check[index]);
        output_data[6].push(input_data_obstacle[index]);
        output_data[7].push(input_data_bump1[index]);
        output_data[8].push(input_data_bump2[index]);
        output_data[9].push(input_data_bump3[index]);
        output_data[10].push(input_data_bump4[index]);
      };
      setTimeout(arrow_line, 375, 30)
      output_data[2].shift();
      output_data[3].shift();
      output_data[4].shift();
      output_data[5].shift();
      output_data[6].shift();
      output_data[7].shift();
      output_data[8].shift();
      output_data[9].shift();
      output_data[10].shift();
      setTimeout(arrow_line, 500, 40)
      output_data[0].push('\n');
      output_data[1].push('\n')
      output_data[2][output_data[2].length - 1] = '\n';
      output_data[3][output_data[3].length - 1] = '\n';
      output_data[4][output_data[4].length - 1] = '\n';
      output_data[5][output_data[5].length - 1] = '\n';
      output_data[6][output_data[6].length - 1] = '\n';
      output_data[7][output_data[7].length - 1] = '\n';
      output_data[8][output_data[8].length - 1] = '\n';
      output_data[9][output_data[9].length - 1] = '\n';
      output_data[10].pop();
      setTimeout(arrow_line, 625, 50)
      //BOMを付与する（Excelでの文字化け対策）
      const bom = new Uint8Array([0xef, 0xbb, 0xbf]);
      //Blobでデータを作成する
      const blob = new Blob([bom, output_data], { type: "text/csv" });
      setTimeout(arrow_line, 750, 60)
      //BlobからオブジェクトURLを作成する
      const url = (window.URL || window.webkitURL).createObjectURL(blob);
      setTimeout(arrow_line, 875, 70)
      //ダウンロード用にリンクを作成する
      const download = document.createElement("a");
      setTimeout(arrow_line, 1000, 80)
      //リンク先に上記で生成したURLを指定する
      download.href = url;
      setTimeout(arrow_line, 1125 ,90)
      //download属性にファイル名を指定する
      download.download = file_name.slice(0, -4) + '_converted.rrl';
      setTimeout(arrow_line, 1250 ,100);
      //作成したリンクをクリックしてダウンロードを実行する
      setTimeout(() => {download.click();}, 1250)
      //createObjectURLで作成したオブジェクトURLを開放する
      setTimeout(() => {(window.URL || window.webkitURL).revokeObjectURL(url)}, 1500)
      setTimeout(() => {$upload_guide.innerHTML = csv_arrays[0].slice(0,6) + '→v3.1.1<br>変換完了';}, 1500)
      setTimeout(() => {$download_guide.style.color = '#000000';}, 1500)
      setTimeout(() => {document.querySelector('#download > img').src = '../img/converter/downloaded.svg';}, 1500)
    }

    //v3.x.x→v4.3.1
    function three_to_Four(file_name){
      $upload_guide.innerHTML = csv_arrays[0].slice(0,6) + '<br>お待ちください...';
      setTimeout(arrow_line, 125, 10)
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
      setTimeout(arrow_line, 250, 20)
      output_data = [[],[],[],[],[],[],[],[],[],[],[]];
      output_data[0].push("v4.3.1")
      output_data[1].push(input_data_show[0])
      for (let index = 0; index < input_data_course.length; index++) {
        output_data[2].push(input_data_course[index]);
        output_data[3].push(input_data_turn[index]);
        output_data[4].push(input_data_border[index]);
        output_data[5].push(input_data_check[index]);
        output_data[6].push(input_data_obstacle[index]);
        output_data[7].push(input_data_bump1[index]);
        output_data[8].push(input_data_bump2[index]);
        output_data[9].push(input_data_bump3[index]);
        output_data[10].push(input_data_bump4[index]);
      };
      setTimeout(arrow_line, 375, 30)
      output_data[2].shift();
      output_data[3].shift();
      output_data[4].shift();
      output_data[5].shift();
      output_data[6].shift();
      output_data[7].shift();
      output_data[8].shift();
      output_data[9].shift();
      output_data[10].shift();
      setTimeout(arrow_line, 500, 40)
      output_data[0].push('\n');
      output_data[2][output_data[2].length - 1] = '\n';
      output_data[3][output_data[3].length - 1] = '\n';
      output_data[4][output_data[4].length - 1] = '\n';
      output_data[5][output_data[5].length - 1] = '\n';
      output_data[6][output_data[6].length - 1] = '\n';
      output_data[7][output_data[7].length - 1] = '\n';
      output_data[8][output_data[8].length - 1] = '\n';
      output_data[9][output_data[9].length - 1] = '\n';
      output_data[10].pop();
      setTimeout(arrow_line, 625, 50)
      document.getElementById('overlay').className = "active";
      document.getElementById('league').className = "active";
      document.getElementById('league_decide').onclick = function () {
        if (document.getElementsByName('league2')[0].checked) {
          output_data[1].push('nrl');
          output_data[1].push('\n');
          document.getElementById('overlay').className = "";
          document.getElementById('league').className = "";
          output(file_name,csv_arrays[0].slice(0,6),'v4.3.1');
        } else {
          output_data[1].push('wrl');
          output_data[1].push('\n');
          document.getElementById('overlay').className = "";
          document.getElementById('league').className = "";
          output(file_name,csv_arrays[0].slice(0,6),'v4.3.1')
        }
      }
    }

    //v4.x.x→v4.3.1
    function four_to_Four(file_name){
      $upload_guide.innerHTML = csv_arrays[0].slice(0,6) + '<br>お待ちください...';
      setTimeout(arrow_line, 125, 10)
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
      setTimeout(arrow_line, 250, 20)
      output_data = [[],[],[],[],[],[],[],[],[],[],[]];
      output_data[0].push("v4.3.1")
      for (let index = 0; index < input_data_show.length; index++) {
        output_data[1].push(input_data_show[index])
      }
      for (let index = 0; index < input_data_course.length; index++) {
        output_data[2].push(input_data_course[index]);
        output_data[3].push(input_data_turn[index]);
        output_data[4].push(input_data_border[index]);
        output_data[5].push(input_data_check[index]);
        output_data[6].push(input_data_obstacle[index]);
        output_data[7].push(input_data_bump1[index]);
        output_data[8].push(input_data_bump2[index]);
        output_data[9].push(input_data_bump3[index]);
        output_data[10].push(input_data_bump4[index]);
      };
      setTimeout(arrow_line, 375, 30)
      output_data[1].shift();
      output_data[2].shift();
      output_data[3].shift();
      output_data[4].shift();
      output_data[5].shift();
      output_data[6].shift();
      output_data[7].shift();
      output_data[8].shift();
      output_data[9].shift();
      output_data[10].shift();
      setTimeout(arrow_line, 500, 40)
      output_data[0].push('\n');
      output_data[1][output_data[1].length - 1] = '\n';
      output_data[2][output_data[2].length - 1] = '\n';
      output_data[3][output_data[3].length - 1] = '\n';
      output_data[4][output_data[4].length - 1] = '\n';
      output_data[5][output_data[5].length - 1] = '\n';
      output_data[6][output_data[6].length - 1] = '\n';
      output_data[7][output_data[7].length - 1] = '\n';
      output_data[8][output_data[8].length - 1] = '\n';
      output_data[9][output_data[9].length - 1] = '\n';
      output_data[10].pop();
      setTimeout(arrow_line, 625, 50)
      output(file_name,csv_arrays[0].slice(0,6),'v4.3.1');
    }

    let reader = new FileReader();
    $uploaded_file.addEventListener('change', () => {
      if ($uploaded_file.files[0].name.slice(-3) === 'rrl') {
        file = $uploaded_file.files[0];
        arrow_line('reset');
        $uploaded_file.nextElementSibling.textContent = file.name;
        $uploaded_file.nextElementSibling.style.color = '#000000';
        $download_guide.innerHTML = file.name.slice(0, -4) + '_converted.rrl';
        $download_guide.style.color = '#888888';
        document.querySelector('#upload > label > img').src = '../img/converter/uploaded.svg';
        reader.readAsText(file);
        reader.onload = function () {
          csv_arrays = reader.result.split('\n');
          if (csv_arrays[0] == "v4.3.1,"){
            window.alert('このファイルは最新版です。')
          } else if (csv_arrays[0] == "v4.0.0," || csv_arrays[0] == "v4.1.0," || csv_arrays[0] == "v4.1.1," || csv_arrays[0] == "v4.2.0," || csv_arrays[0] == "v4.2.1," || csv_arrays[0] == "v4.2.2," || csv_arrays[0] == "v4.3.0,"){
            four_to_Four(file.name);
          } else if (csv_arrays[0] == "v3.0.0," || csv_arrays[0] == "v3.0.1," || csv_arrays[0] == "v3.1.0," || csv_arrays[0] == "v3.1.1,"){
            three_to_Four(file.name);
          } else if(csv_arrays[0] == "v2.0.2," || csv_arrays[0] == "v2.0.1," || csv_arrays[0] == "v2.0.0,"){
            two_to_Four(file.name);
          } else {
            one_to_Four(file.name);
          }
        }
      } else {
        window.alert('RRL形式のファイル以外には対応していません。')
      }
    });

    $tools[0].addEventListener('click', () => {
      if (file == null){
        window.alert('まだ何も変換していません。ファイルを指定すると変換されます。')
      } else {
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
        download.download = file.name.slice(0, -4) + '_converted.rrl';
        //作成したリンクをクリックしてダウンロードを実行する
        download.click();
        //createObjectURLで作成したオブジェクトURLを開放する
        (window.URL || window.webkitURL).revokeObjectURL(url)
      }
    });

    //ヘルプ
    $tools[1].addEventListener('click', ()=> {
      window.open('help.html')
    });
    //ヘルプ(F1キー)
    window.addEventListener("keydown", function(e){
      if (e.key == "F1") {
        e.preventDefault();
        window.open('help.html')
      }
    });
  })();