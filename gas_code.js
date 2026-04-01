/**
 * Google Apps Script: ラオス語単語クイズ回答データ受信用
 * 
 * 手順:
 * 1. Googleスプレッドシートを新規作成します。
 * 2. メニューの「拡張機能」>「Apps Script」を開きます。
 * 3. エディタにこのコードを貼り付けます。
 * 4. 右上の「デプロイ」>「新しいデプロイ」をクリックします。
 * 5. 種類を「ウェブアプリ」に設定し、アクセスできるユーザーを「全員」にしてデプロイします。
 * 6. 発行された「ウェブアプリのURL」をHTMLの GAS_URL に貼り付けます。
 */

function doPost(e) {
  try {
    const params = JSON.parse(e.postData.contents);
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    
    // ヘッダーがない場合は作成
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(["タイムスタンプ", "デバイスID", "正解数", "問題数", "正答率"]);
    }
    
    const timestamp = params.timestamp || new Date().toISOString();
    const deviceId = params.deviceId || "unknown";
    const correct = params.correct;
    const total = params.total;
    const rate = Math.round((correct / total) * 100) + "%";
    
    sheet.appendRow([timestamp, deviceId, correct, total, rate]);
    
    return ContentService.createTextOutput(JSON.stringify({ status: "success" }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ status: "error", message: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  return ContentService.createTextOutput("GAS is running. Please use POST method to send data.");
}
