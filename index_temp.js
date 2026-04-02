// checkAnswer関数の修正部分（正解・不正解判定）
// 【要件①③④】回答時間を記録し、不正解時に音声再生機能を追加

if (isCorrect) {
    feedback.textContent = '正解です！素晴らしい！';
    feedback.className = 'feedback correct';
    score++;
    quizHistory.push({ lao: lao, correct: correctText, status: 'correct', time: responseTime });
} else {
    // 【要件③④】不正解時に正解テキストをクリック可能にして音声再生機能を追加
    const feedbackHTML = `不正解... 正解は<span class="clickable-answer" data-text="${correctText}" style="cursor: pointer; text-decoration: underline; font-weight: bold;">「${correctText}」</span>でした`;
    feedback.innerHTML = feedbackHTML;
    feedback.className = 'feedback incorrect';
    
    // クリック可能な正解テキストにイベントリスナーを追加
    const clickableSpan = feedback.querySelector('.clickable-answer');
    if (clickableSpan) {
        clickableSpan.addEventListener('click', function() {
            playAnswerAudio(this.getAttribute('data-text'));
        });
    }
    
    quizHistory.push({ lao: lao, correct: correctText, status: 'incorrect', time: responseTime });
}
