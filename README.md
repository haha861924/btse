# 訂單簿應用程式

這是一個基於 Vue 3、TypeScript 和 Vite 的訂單簿應用程式，旨在實時顯示買賣報價，並提供直觀的用戶體驗。

## 功能需求

### 主要任務

- **框架**: 使用 Vue.js
- **報價顯示**: 最多顯示 8 條買賣報價。報價行應垂直居中對齊。
- **數字格式化**: 使用逗號作為千位分隔符格式化數字。
- **滑鼠懸停效果**: 整行報價在滑鼠懸停時背景顏色變化。
- **最後價格顏色樣式**:
  - 當當前最後價格 > 前一最後價格: 文本顏色 `#00b15d`，背景顏色 `rgba(16, 186, 104, 0.12)`
  - 當當前最後價格 < 前一最後價格: 文本顏色 `#FF5B5A`，背景顏色 `rgba(255, 90, 90, 0.12)`
  - 當價格相同: 文本顏色 `#F0F4F8`，背景顏色 `rgba(134, 152, 170, 0.12)`
- **報價總和公式**:
  - 賣出報價: 從最低價格報價到最高價格報價的總和
  - 買入報價: 從最高價格報價到最低價格報價的總和
- **累積總大小百分比條公式**:
  - 當前報價累積總大小 / 買入或賣出報價的總大小
- **報價高亮動畫**:
  - 當新報價出現（價格未在訂單簿中顯示過），整行報價添加高亮動畫。賣出報價為紅色背景，買入報價為綠色背景。
  - 當報價大小改變時，大小單元格添加高亮動畫。若大小增加，背景為綠色；若大小減少，背景為紅色。

### WebSocket API

- **訂單簿 WebSocket API**:
  - **端點**: `wss://ws.btse.com/ws/oss/futures`
  - **主題**: `update:BTCPFC`
  - **API 文檔**: [BTSE API Docs](https://btsecom.github.io/docs/futures/en/#orderbook-incremental-updates)
  - **注意**: 首次接收到的響應將是當前訂單簿的快照，並返回 50 個層級。隨後的增量更新將在後續數據包中發送，類型為 `delta`。

- **最後價格 WebSocket API**:
  - **端點**: `wss://ws.btse.com/ws/futures`
  - **主題**: `tradeHistoryApi:BTCPFC`
  - **API 文檔**: [BTSE API Docs](https://btsecom.github.io/docs/futures/en/#public-trade-fills)

### 樣式

- **背景顏色**: `#131B29`
- **默認文本顏色**: `#F0F4F8`
- **報價表頭文本顏色**: `#8698aa`
- **買入報價價格文本顏色**: `#00b15d`
- **賣出報價價格文本顏色**: `#FF5B5A`
- **報價行懸停背景顏色**: `#1E3059`
- **買入報價累積總大小條顏色**: `rgba(16, 186, 104, 0.12)`
- **賣出報價累積總大小條顏色**: `rgba(255, 90, 90, 0.12)`
- **動畫閃爍綠色背景顏色**: `rgba(0, 177, 93, 0.5)`
- **動畫閃爍紅色背景顏色**: `rgba(255, 91, 90, 0.5)`

## 安裝與運行

1. 克隆此倉庫：
   ```bash
   git clone git@github.com:haha861924/btse.git
   ```
2. 進入專案目錄：
   ```bash
   cd btse
   ```
3. 啟動開發伺服器：
   ```bash
   pnpm dev
   ```

## 資料夾結構
.
* ├── README.md          # 專案說明文件
* ├── index.html         # 主頁面
* ├── jest.config.ts     # Jest 測試框架配置文件
* ├── package.json       # npm 依賴和腳本
* ├── public             # 公共資源資料夾
* │   └── vite.svg
* ├── src                # 程式碼資料夾
* │   ├── App.vue        # 主應用組件
* │   ├── assets         # 靜態資源
* │   ├── components     # 複用組件
* │   ├── enum           # 列舉類型定義
* │   ├── main.ts
* │   ├── stores         # 狀態管理
* │   ├── style.css      # 全域樣式文件
* │   ├── utils          # 工具函式
* │   └── vite-env.d.ts  # Vite 環境類型定義
* ├── test               # 測試資料夾
* │   └── number.test.ts # number 相關的單元測試
* ├── tsconfig.app.json  # 應用的 TypeScript 配置
* ├── tsconfig.json      # 全域 TypeScript 配置
* ├── tsconfig.node.json  # Node 環境的 TypeScript 配置
* └── vite.config.ts     # Vite 配置文件

