import { defineMvuDataStore } from '@util/mvu';
import { Schema } from './schema';

// 关键: 用 'latest' 而非 getCurrentMessageId()
// getCurrentMessageId() 返回面板所在楼层(固定),AI 回复后变量更新在新楼层,面板读不到
// 'latest' 会被 defineMvuDataStore 转成 -1(深度索引),getVariables 每 2 秒动态解析为最新楼层
// 这样面板始终读取最新楼层的 stat_data,AI 更新物品后面板会自动同步
export const useDataStore = defineMvuDataStore(Schema, { type: 'message', message_id: 'latest' });
