/**
 * Google Apps Script: ラオス語単語クイズ回答データ受信用 (Ver0.6 堅牢版)
 * 
 * 手順:
 * 1. Googleスプレッドシートを新規作成します。
 * 2. メニューの「拡張機能」>「Apps Script」を開きます。
 * 3. エディタにこのコードを貼り付けます。
 * 4. 右上の「デプロイ」>「新しいデプロイ」をクリックします。
 * 5. 種類を「ウェブアプリ」に設定し、アクセスできるユーザーを「全員」にしてデプロイします。
 * 6. 発行された「ウェブアプリのURL」をHTMLの GAS_URL に貼り付けます。
 * 
 * 注意: GASエディタの「実行」ボタンを押すとエラーになりますが、それは正常です。
 * HTMLアプリからデータが送られてきたときに正しく動作します。
 */

function doPost(e) {
  try {
    let params = {};
    
    // 1. データの抽出
    if (e && e.postData && e.postData.contents) {
      // JSON形式の場合
      try {
        params = JSON.parse(e.postData.contents);
      } catch (jsonError) {
        // JSONパース失敗時はそのまま
      }
    }
    
    // 2. フォーム形式（URLSearchParams）の場合の上書き
    if (e && e.parameter) {
      for (let key in e.parameter) {
        params[key] = e.parameter[key];
      }
    }
    
    // 3. スプレッドシートの取得
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheets()[0]; // 最初のシート
    
    // 4. ヘッダーがない場合は作成
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(["タイムスタンプ", "デバイスID", "正解数", "問題数", "正答率"]);
    }
    
    // 5. データの整理
    const timestamp = params.timestamp || new Date().toLocaleString("ja-JP");
    const deviceId = params.deviceId || "unknown";
    const correct = params.correct || 0;
    const total = params.total || 0;
    const rate = total > 0 ? Math.round((correct / total) * 100) + "%" : "0%";
    
    // 6. 書き込み
    sheet.appendRow([timestamp, deviceId, correct, total, rate]);
    
    // 7. 成功レスポンス
    return ContentService.createTextOutput(JSON.stringify({ status: "success" }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    // エラー時はログを記録し、エラー内容を返す
    console.error("Error in doPost: " + error.toString());
    return ContentService.createTextOutput(JSON.stringify({ status: "error", message: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  return ContentService.createTextOutput("GAS is running. Please use POST method to send data.");
}
