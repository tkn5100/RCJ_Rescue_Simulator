# RoboCupJunior コート作成環境
ロボカップジュニアレスキューラインの競技者のためのソフトウェアです。機能は以下の通りです。ルールは2022年版に準拠します。

## ソフトウェアのご利用方法
[RCJ コート作成環境の最新版](https://tkn5100.github.io/RCJ_Rescue_Simulator/ "RCJ コート作成環境")  
上のリンクからご利用いただけます。  
  
ローカルで使用する場合、Zipファイルをダウンロードして任意のフォルダに展開して「index.html」をブラウザで開きます。ただしこの方法をiPhoneやiPadで行うためには、外部css・jsファイルを使用したローカルHTMLファイルを表示できる専用のアプリが必要となります。

### ご注意
**画像を多用したソフトウェアであるため、上のリンクからWeb上で利用される場合には通信量が大きくなることがあります。**

### お願い
iPhone・iPadではブラウザの**ツールバーを非表示**にしてお使いください。操作に支障をきたすおそれがあります。  
また、各種スマートフォンは画面が小さいため横向きでのご利用を推奨いたします。

## ソフトウェアについて
### 主な機能
#### コート作成
ロボカップジュニアジャパンレスキューライン(NRL/WRL)のコートを作成できます。
#### NRL得点計算
コート作成で作成したコートのうちNRLのものを用いて、競技の得点をその場で算出できます。
#### WRL得点計算
コート作成で作成したコートのうちWRLのものを用いて、競技の得点をその場で算出できます。
#### ファイル変換
古いバージョンのコート作成で保存したプロジェクトファイルを最新版で読み込めるよう変換できます。

### 開発の経緯
2021年1月22日までは、同じくロボカップジュニアレスキューラインのコートを作成するソフトウェアとして「RoboCupJunior NRL コート作成環境」と「RoboCupJunior WRL コート作成環境」(以下2つ合わせて「旧ソフトウェア」と表記)を開発していました。しかし、アップデートを重ね機能がほぼ同じになってきたこと、またWRL向けのソフトウェアでNRLのコートも作成可能であることから、WRL版にNRL版を組み込む形で新たにこの「RoboCupJunior コート作成環境」を作成することとしました。2022年1月29日に公開したRC3版で動作が安定したことからそれをv1.0.0とし、UIの改善と機能追加を重ねています。旧ソフトウェアのGitHub上での公開はしていません。

### バージョンの命名規則
セマンティック・バージョニングを参考にしており、vX.Y.Zのようにつけます。Xはメジャーバージョンで、RRLファイルの互換性がなくなるなど大きな変更があった場合に数字を1つ上げます。Yはマイナーバージョンで、機能性を追加した場合に数字を1つ上げます。Zはパッチバージョンで、バグ修正など細かい変更の際に数字を1つ上げます。詳しくは下記URLをご覧ください。  
[セマンティック バージョニング 2.0.0](https://semver.org/lang/ja/ "セマンティック バージョニング 2.0.0")

### 動作環境
#### 正常動作確認済みの環境
Windows11 Home 21H2(Microsoft Edge v103.0.1264.62,Google Chrome v103.0.5060.114)  
iPadOS 15.4.1(Safari v605.1.15)  
iOS 15.6(Safari v604.1)
#### 正常動作可能と思われる環境
Windows10(Microsoft Edge,Google Chrome,Opera,FireFox各最新版)  
Windows11(Microsoft Edge,Google Chrome,Opera,FireFox各最新版)  
Mac OS(Safari,Google Chrome,Microsoft Edge,Opera,FireFox各最新版)  
Linux OS(Google Chrome,Microsoft Edge,Safari,Opera,FireFox各最新版)  
Chrome OS(Google Chrome,Opera,FireFox各最新版)  
AndroidOS(Google Chrome,Microsoft Edge,Safari,Opera,FireFox,Samsung Internet各最新版)
#### Web上でのみ動作可能な環境
iOS(Safari,Google Chrome,Microsoft Edge,Opera,FireFox各最新版)  
iPadOS(Safari,Google Chrome,Microsoft Edge,Opera,FireFox各最新版)
#### 動作不可能である環境
Windows10(旧Microsoft Edge,Internet Explorer,旧Opera)  
その他PC向け旧OS

### アプリケーションの調子が悪いときは
リロードせずに長時間使い続けると、動作が重くなったり不具合が出ることがあります。再読み込みするか、「Ctrl+F5」を押してスーパーリロードしてください。ただし、プロジェクトを保存するのを忘れないでください。なお、再読み込みを行っても自動保存データは保持されます。
### その他
無断での転載、商用利用は禁止します。  
Copyright&copy; 2021-2022 TKN All Rights Reserved.
### 付記
このソフトウェアの開発に力を貸してくださっている ゆき 氏に感謝申し上げます。