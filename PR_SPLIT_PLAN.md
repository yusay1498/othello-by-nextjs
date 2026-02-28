# PR分割計画

## 問題の背景

元のPR（`claude/continue-implementation-under-constraints`）は「1機能につき1PR」の規約に違反していました。
複数の機能（型定義、ボード操作、ゲームルール、勝敗判定、AI実装）が1つのPRに含まれていたため、
レビューが困難で、規約に準拠していませんでした。

## 分割戦略

ドメイン層の実装を依存関係に基づいて5つの独立したPRに分割しました：

### PR1: Domain Foundation (feature/domain-foundation)
**ブランチ**: `feature/domain-foundation`
**PRタイトル**: Add domain layer type definitions and constants

**含まれるファイル**:
- `src/domain/game/types.ts` - 型定義
- `src/domain/game/constants.ts` - 定数定義
- `src/domain/game/__tests__/constants.test.ts` - 定数のテスト
- `src/domain/game/index.ts` - エクスポート（型と定数のみ）

**説明**: プロジェクトの基盤となる型定義と定数を提供します。

**依存関係**: なし（独立）

---

### PR2: Board Operations (feature/domain-board)
**ブランチ**: `feature/domain-board`
**PRタイトル**: Implement board operations for Othello game

**含まれるファイル**:
- `src/domain/game/board.ts` - ボード操作関数
- `src/domain/game/__tests__/board.test.ts` - ボード操作のテスト
- `src/domain/game/index.ts` - エクスポート更新

**主な機能**:
- `createInitialBoard()` - 初期盤面の生成
- `getScore()` - 各プレイヤーの石の数を計算
- `getOpponent()` - 相手プレイヤーを取得

**依存関係**: PR1（types, constants）

---

### PR3: Game Rules (feature/domain-rules)
**ブランチ**: `feature/domain-rules`
**PRタイトル**: Implement game rules and legal move validation

**含まれるファイル**:
- `src/domain/game/rules.ts` - ゲームルール実装
- `src/domain/game/__tests__/rules.test.ts` - ルールのテスト
- `src/domain/game/index.ts` - エクスポート更新

**主な機能**:
- `getLegalMoves()` - 合法手の取得
- `applyMove()` - 手を適用して新しい状態を返す
- `isGameOver()` - ゲーム終了判定

**依存関係**: PR1（types, constants）、PR2（board operations）

---

### PR4: Winner Detection (feature/domain-winner)
**ブランチ**: `feature/domain-winner`
**PRタイトル**: Implement game result and winner detection

**含まれるファイル**:
- `src/domain/game/winner.ts` - 勝敗判定機能
- `src/domain/game/__tests__/winner.test.ts` - 勝敗判定のテスト
- `src/domain/game/index.ts` - エクスポート更新

**主な機能**:
- `getGameResult()` - ゲーム結果の判定（勝ち、負け、引き分け、パーフェクト）

**依存関係**: PR1（types, constants）、PR2（board operations）

---

### PR5: AI Implementation (feature/domain-ai)
**ブランチ**: `feature/domain-ai`
**PRタイトル**: Implement AI engine with minimax algorithm

**含まれるファイル**:
- `src/domain/game/ai.ts` - AI思考エンジン
- `src/domain/game/__tests__/ai.test.ts` - AIのテスト
- `src/domain/game/index.ts` - エクスポート更新

**主な機能**:
- `evaluateBoard()` - 盤面評価関数
- `getBestMove()` - ミニマックス法による最善手探索（αβ枝刈り付き）

**依存関係**: PR1-4（全てのドメイン層機能）

---

## マージ順序

PRは依存関係の順序でマージする必要があります：

1. **PR1 (foundation)** ← 最初にマージ
2. **PR2 (board)** ← PR1のマージ後
3. **PR3 (rules)** と **PR4 (winner)** ← PR2のマージ後（並行可能）
4. **PR5 (ai)** ← PR2, PR3, PR4のマージ後

## 各PRのテスト状態

全てのPRには対応するテストが含まれており、独立して実行可能です：

- **PR1**: 14テスト（定数の検証）
- **PR2**: 15テスト（ボード操作）
- **PR3**: 19テスト（ゲームルール）
- **PR4**: 12テスト（勝敗判定）
- **PR5**: 7テスト（AI思考）

**合計**: 67テスト（全て合格）

## 今後の進め方

1. 各ブランチからGitHub上でPRを作成
2. 依存関係の順序でレビューとマージを実施
3. マージ済みのブランチは削除
4. 元のブランチ `claude/continue-implementation-under-constraints` はクローズ

## 利点

この分割により：
- ✅ 「1機能につき1PR」の規約に準拠
- ✅ レビュー負荷の軽減（各PRは独立した小さな変更）
- ✅ 段階的なマージが可能
- ✅ 各機能の責務が明確
- ✅ 問題が発生した場合のロールバックが容易
