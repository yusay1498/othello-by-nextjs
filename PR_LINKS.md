# PR作成リンク集

このドキュメントには、5つのPRを簡単に作成するためのGitHubリンクが含まれています。
各リンクをクリックすると、PRディスクリプションが事前に入力された状態でPR作成画面が開きます。

## PR作成リンク

### PR1: Domain Foundation
**ブランチ**: `feature/domain-foundation` → `master`

[🔗 PR1を作成する](https://github.com/yusay1498/othello-by-nextjs/compare/master...feature/domain-foundation?expand=1&title=Add%20domain%20layer%20type%20definitions%20and%20constants)

**手動で入力する場合のタイトル**:
```
Add domain layer type definitions and constants
```

**ディスクリプション**: `PR_CREATION_GUIDE.md` の PR1 セクションを参照

---

### PR2: Board Operations
**ブランチ**: `feature/domain-board` → `master`

[🔗 PR2を作成する](https://github.com/yusay1498/othello-by-nextjs/compare/master...feature/domain-board?expand=1&title=Implement%20board%20operations%20for%20Othello%20game)

**手動で入力する場合のタイトル**:
```
Implement board operations for Othello game
```

**ディスクリプション**: `PR_CREATION_GUIDE.md` の PR2 セクションを参照

---

### PR3: Game Rules
**ブランチ**: `feature/domain-rules` → `master`

[🔗 PR3を作成する](https://github.com/yusay1498/othello-by-nextjs/compare/master...feature/domain-rules?expand=1&title=Implement%20game%20rules%20and%20legal%20move%20validation)

**手動で入力する場合のタイトル**:
```
Implement game rules and legal move validation
```

**ディスクリプション**: `PR_CREATION_GUIDE.md` の PR3 セクションを参照

---

### PR4: Winner Detection
**ブランチ**: `feature/domain-winner` → `master`

[🔗 PR4を作成する](https://github.com/yusay1498/othello-by-nextjs/compare/master...feature/domain-winner?expand=1&title=Implement%20game%20result%20and%20winner%20detection)

**手動で入力する場合のタイトル**:
```
Implement game result and winner detection
```

**ディスクリプション**: `PR_CREATION_GUIDE.md` の PR4 セクションを参照

---

### PR5: AI Implementation
**ブランチ**: `feature/domain-ai` → `master`

[🔗 PR5を作成する](https://github.com/yusay1498/othello-by-nextjs/compare/master...feature/domain-ai?expand=1&title=Implement%20AI%20engine%20with%20minimax%20algorithm%20and%20board%20evaluation)

**手動で入力する場合のタイトル**:
```
Implement AI engine with minimax algorithm and board evaluation
```

**ディスクリプション**: `PR_CREATION_GUIDE.md` の PR5 セクションを参照

---

## 使用方法

1. 上記のリンクを順番にクリック（PR1から開始を推奨）
2. タイトルが自動入力されていることを確認
3. `PR_CREATION_GUIDE.md` から対応するPRディスクリプションをコピー
4. GitHubのPR作成画面にディスクリプションを貼り付け
5. "Create pull request" をクリック

## マージ順序

1. **PR1 (foundation)** ← 最初にマージ
2. **PR2 (board)** ← PR1のマージ後
3. **PR3 (rules)** と **PR4 (winner)** ← PR2のマージ後（並行可能）
4. **PR5 (ai)** ← PR2, PR3, PR4のマージ後

## 注意事項

- 全てのブランチはリモートリポジトリに既に存在しています
- 各ブランチには完全なテストが含まれており、全て合格しています
- PRディスクリプションには、動機、変更内容、依存関係、テスト結果が含まれています
