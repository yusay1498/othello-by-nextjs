#!/bin/bash

# PR作成スクリプト
# このスクリプトは、PR_SPLIT_PLAN.mdに基づいて5つのPRを作成します

set -e

echo "==================================="
echo "PR作成スクリプト"
echo "==================================="
echo ""

# PR1: Domain Foundation
echo "PR1: Domain Foundationを作成中..."
gh pr create \
  --base master \
  --head feature/domain-foundation \
  --title "Add domain layer type definitions and constants" \
  --body "$(cat <<'EOF'
## 概要

プロジェクトの基盤となるドメイン層の型定義と定数を追加します。

## 動機

オセロゲームのドメインモデルを実装するための基礎として、以下が必要です：
- ゲームで使用する基本的な型定義
- ボードサイズや方向などの定数定義

この基盤の上に、後続のPRでボード操作、ゲームルール、勝敗判定、AI機能を実装していきます。

## 提案された変更

### 追加されたファイル

1. **src/domain/game/types.ts** - 型定義
   - `Player`: プレイヤーの色（"black" | "white"）
   - `Cell`: 盤面の各マスの状態（Player | null）
   - `Board`: 64マスの盤面（Cell[]）
   - `Position`: 盤面上の位置（0-63）
   - `GameState`: ゲーム状態（board + currentPlayer）
   - `WinnerResult`: 勝敗結果の型

2. **src/domain/game/constants.ts** - 定数定義
   - `BOARD_SIZE`: ボードのサイズ（8x8）
   - `TOTAL_CELLS`: 総マス数（64）
   - `DIRECTIONS`: 8方向の移動量
   - `CORNERS`: 4つの角の位置
   - `POSITION_WEIGHTS`: AI評価関数用の位置重み

3. **src/domain/game/__tests__/constants.test.ts** - 定数のテスト
   - 定数値の妥当性を検証する14のテストケース

4. **src/domain/game/index.ts** - エクスポート
   - 型と定数のエクスポート

### テスト結果

✅ 14テスト全て合格

## 関連課題

このPRは、「1機能につき1PR」の規約に準拠するため、元のPR（複数機能を含む）を分割したものです。
詳細は `PR_SPLIT_PLAN.md` と `BRANCH_SUMMARY.md` を参照してください。

## チェックリスト

- [x] TypeScriptで記述
- [x] 適切な型定義を追加
- [x] テストを作成し、全て合格
- [x] コードレビュー実施済み
- [x] ドキュメント（DESIGN.md）と整合性あり
EOF
)"

echo "✓ PR1作成完了"
echo ""

# PR2: Board Operations
echo "PR2: Board Operationsを作成中..."
gh pr create \
  --base master \
  --head feature/domain-board \
  --title "Implement board operations for Othello game" \
  --body "$(cat <<'EOF'
## 概要

オセロゲームのボード操作機能を実装します。

## 動機

オセロゲームの基本的なボード操作として、以下の機能が必要です：
- 初期盤面の生成
- スコア計算（各プレイヤーの石の数）
- 相手プレイヤーの取得

これらの機能は、ゲームルールやUI表示の基盤となります。

## 提案された変更

### 追加されたファイル

1. **src/domain/game/board.ts** - ボード操作関数
   - `createInitialBoard()`: 初期盤面を生成（中央4マスに石を配置）
   - `getScore()`: 各プレイヤーの石の数を計算
   - `getOpponent()`: 相手プレイヤーを取得

2. **src/domain/game/__tests__/board.test.ts** - ボード操作のテスト
   - 15のテストケース

3. **src/domain/game/index.ts** - エクスポート更新
   - ボード関数のエクスポートを追加

### テスト結果

✅ 15テスト全て合格

## 依存関係

このPRは以下に依存します：
- PR1（Domain Foundation）: types.ts, constants.ts

## 関連課題

このPRは、「1機能につき1PR」の規約に準拠するため、元のPR（複数機能を含む）を分割したものです。
詳細は `PR_SPLIT_PLAN.md` と `BRANCH_SUMMARY.md` を参照してください。

## チェックリスト

- [x] TypeScriptで記述
- [x] 純粋関数として実装
- [x] 適切な型定義を使用
- [x] テストを作成し、全て合格
- [x] 日本語コメント追加
- [x] ドキュメント（DESIGN.md）と整合性あり
EOF
)"

echo "✓ PR2作成完了"
echo ""

# PR3: Game Rules
echo "PR3: Game Rulesを作成中..."
gh pr create \
  --base master \
  --head feature/domain-rules \
  --title "Implement game rules and legal move validation" \
  --body "$(cat <<'EOF'
## 概要

オセロゲームのルールと合法手判定ロジックを実装します。

## 動機

オセロゲームのコアロジックとして、以下の機能が必要です：
- 合法手の判定と一覧取得
- 手を打った際の石の裏返し処理
- ゲーム終了判定

これらはゲームの進行に不可欠な機能です。

## 提案された変更

### 追加されたファイル

1. **src/domain/game/rules.ts** - ゲームルール実装
   - `getLegalMoves()`: 現在のプレイヤーの合法手を取得
   - `applyMove()`: 手を適用して新しいゲーム状態を返す（石の裏返しを含む）
   - `isGameOver()`: ゲーム終了判定（両プレイヤーが手を打てない場合）
   - ヘルパー関数: `isValidMove()`, `canFlip()`, `getFlippedPositions()`

2. **src/domain/game/__tests__/rules.test.ts** - ルールのテスト
   - 19のテストケース（合法手判定、石の裏返し、ゲーム終了など）

3. **src/domain/game/index.ts** - エクスポート更新
   - ルール関数のエクスポートを追加

### テスト結果

✅ 19テスト全て合格

## 依存関係

このPRは以下に依存します：
- PR1（Domain Foundation）: types.ts, constants.ts
- PR2（Board Operations）: board.ts

## 関連課題

このPRは、「1機能につき1PR」の規約に準拠するため、元のPR（複数機能を含む）を分割したものです。
詳細は `PR_SPLIT_PLAN.md` と `BRANCH_SUMMARY.md` を参照してください。

## チェックリスト

- [x] TypeScriptで記述
- [x] 純粋関数として実装
- [x] オセロルールを正確に実装
- [x] エッジケース処理
- [x] テストを作成し、全て合格
- [x] 日本語コメント追加
- [x] ドキュメント（DESIGN.md）と整合性あり
EOF
)"

echo "✓ PR3作成完了"
echo ""

# PR4: Winner Detection
echo "PR4: Winner Detectionを作成中..."
gh pr create \
  --base master \
  --head feature/domain-winner \
  --title "Implement game result and winner detection" \
  --body "$(cat <<'EOF'
## 概要

ゲーム結果と勝敗判定機能を実装します。

## 動機

ゲーム終了時に以下を判定する機能が必要です：
- 勝者の決定
- 引き分けの判定
- パーフェクト勝利（64-0）の判定

## 提案された変更

### 追加されたファイル

1. **src/domain/game/winner.ts** - 勝敗判定機能
   - `getGameResult()`: ゲーム結果を判定
     - 勝ち（winner + perfect flag）
     - 引き分け
     - プレイ中

2. **src/domain/game/__tests__/winner.test.ts** - 勝敗判定のテスト
   - 12のテストケース（勝ち、負け、引き分け、パーフェクト勝利など）

3. **src/domain/game/index.ts** - エクスポート更新
   - 勝敗判定関数のエクスポートを追加

### テスト結果

✅ 12テスト全て合格

## 依存関係

このPRは以下に依存します：
- PR1（Domain Foundation）: types.ts, constants.ts
- PR2（Board Operations）: board.ts

## 関連課題

このPRは、「1機能につき1PR」の規約に準拠するため、元のPR（複数機能を含む）を分割したものです。
詳細は `PR_SPLIT_PLAN.md` と `BRANCH_SUMMARY.md` を参照してください。

## チェックリスト

- [x] TypeScriptで記述
- [x] 純粋関数として実装
- [x] 全ての勝敗パターンに対応
- [x] テストを作成し、全て合格
- [x] 日本語コメント追加
- [x] ドキュメント（DESIGN.md）と整合性あり
EOF
)"

echo "✓ PR4作成完了"
echo ""

# PR5: AI Implementation
echo "PR5: AI Implementationを作成中..."
gh pr create \
  --base master \
  --head feature/domain-ai \
  --title "Implement AI engine with minimax algorithm and board evaluation" \
  --body "$(cat <<'EOF'
## 概要

ミニマックスアルゴリズムを用いたAI思考エンジンを実装します。

## 動機

CPU対戦機能を提供するため、以下が必要です：
- 盤面評価関数
- ミニマックス法による最善手探索
- αβ枝刈りによる探索の最適化

## 提案された変更

### 追加されたファイル

1. **src/domain/game/ai.ts** - AI思考エンジン
   - `evaluateBoard()`: 盤面評価関数
     - 石の数による評価
     - 位置の重み付け（角、辺、内部）
     - 合法手の数による評価
   - `getBestMove()`: ミニマックス法による最善手探索
     - αβ枝刈り実装
     - 深さ制限付き探索

2. **src/domain/game/__tests__/ai.test.ts** - AIのテスト
   - 7のテストケース（評価関数、最善手探索など）

3. **src/domain/game/index.ts** - エクスポート更新
   - AI関数のエクスポートを追加

### テスト結果

✅ 7テスト全て合格

## 依存関係

このPRは以下に依存します：
- PR1（Domain Foundation）: types.ts, constants.ts
- PR2（Board Operations）: board.ts
- PR3（Game Rules）: rules.ts
- PR4（Winner Detection）: winner.ts

## 技術的詳細

- **アルゴリズム**: ミニマックス法 + αβ枝刈り
- **探索深さ**: デフォルト2（調整可能）
- **評価要素**:
  1. 石の数の差
  2. 位置の重み（角=100、隣接=-20など）
  3. 合法手の数

## 関連課題

このPRは、「1機能につき1PR」の規約に準拠するため、元のPR（複数機能を含む）を分割したものです。
詳細は `PR_SPLIT_PLAN.md` と `BRANCH_SUMMARY.md` を参照してください。

## チェックリスト

- [x] TypeScriptで記述
- [x] 純粋関数として実装
- [x] αβ枝刈り実装
- [x] テストを作成し、全て合格
- [x] 日本語コメント追加
- [x] ドキュメント（DESIGN.md）と整合性あり
EOF
)"

echo "✓ PR5作成完了"
echo ""

echo "==================================="
echo "全てのPR作成が完了しました！"
echo "==================================="
echo ""
echo "作成されたPR:"
echo "1. Add domain layer type definitions and constants"
echo "2. Implement board operations for Othello game"
echo "3. Implement game rules and legal move validation"
echo "4. Implement game result and winner detection"
echo "5. Implement AI engine with minimax algorithm and board evaluation"
echo ""
echo "マージ順序:"
echo "1. PR1 (foundation) ← 最初にマージ"
echo "2. PR2 (board) ← PR1のマージ後"
echo "3. PR3 (rules) と PR4 (winner) ← PR2のマージ後（並行可能）"
echo "4. PR5 (ai) ← PR2, PR3, PR4のマージ後"
