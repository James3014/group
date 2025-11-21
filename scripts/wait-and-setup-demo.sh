#!/bin/bash

echo "等待部署完成並建立 Demo Trip..."
echo ""

# 等待 API 可用
max_attempts=20
attempt=0

while [ $attempt -lt $max_attempts ]; do
  echo "嘗試 $((attempt + 1))/$max_attempts: 檢查 API 是否可用..."
  
  response=$(curl -s -o /dev/null -w "%{http_code}" -X POST https://group.zeabur.app/api/admin/setup-demo)
  
  if [ "$response" = "200" ] || [ "$response" = "500" ]; then
    echo "✅ API 已可用！正在建立 Demo Trip..."
    result=$(curl -s -X POST https://group.zeabur.app/api/admin/setup-demo)
    echo ""
    echo "=== 結果 ==="
    echo "$result" | jq . || echo "$result"
    echo ""
    
    # 提取 trip_id
    trip_id=$(echo "$result" | jq -r '.trip.id' 2>/dev/null)
    
    if [ ! -z "$trip_id" ] && [ "$trip_id" != "null" ]; then
      echo "✅ Demo Trip 建立成功！"
      echo ""
      echo "📝 請執行以下步驟："
      echo "1. 前往 Zeabur Dashboard"
      echo "2. 新增環境變數: NEXT_PUBLIC_DEMO_TRIP_ID=$trip_id"
      echo "3. 重新部署"
    else
      echo "$result"
    fi
    
    exit 0
  fi
  
  attempt=$((attempt + 1))
  sleep 10
done

echo "❌ 等待逾時，請稍後手動執行"
