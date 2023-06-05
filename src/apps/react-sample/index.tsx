import React, {useState} from 'react';
import ReactDOM from 'react-dom';
import appIds from '../../common/app_ids';
import bigimage from '../../images/10MB.png';
import bigimage2 from '../../images/10MB.png';


// Componentの定義
const ChecklistComponent: React.FC<{records: KintoneTypes.SavedCustomer[]}> = ({records}) => {
  // チェックしたIDを保管する
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  

  // ボタンを押したときのハンドラ
  const buttonHandler = () => {
    if (selectedIds.length === 0) {
      alert('何も選択されていません。');
      return;
    }
    // なにか選択されていれば、会社名を表示する。
    alert(`${selectedIds.map((id) => records.find((r) => r.$id.value === id)?.会社名.value).join('\n')}`);
  };

  // チェックボックスを押したときのハンドラ
  const checkboxHandler = (recordId: string) => (e:React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      console.log("appIds取得");
      console.log({appIds:appIds});

      // チェックされた場合、チェックしたIDを含めて新しい配列を返却
      setSelectedIds((current) => [...current, recordId]);
    } else {
      // チェックを外された場合、チェックしたIDを消す
      setSelectedIds((current) => {
        // すでに選ばれているか念の為確認
        const targetIndex = current.indexOf(recordId);
        if (targetIndex === -1) return current;
        // 該当のindexを切り取って新しい配列を返却
        return [...current.slice(0, targetIndex), ...current.slice(targetIndex + 1)];
      });
    }
  };

  // 要素の定義と返却
  return <div style={{margin: '8px 16px'}}>
    <div><button onClick={buttonHandler}>選択されている顧客を表示する</button></div>
    <img src={bigimage} alt="sample" />
    <img src={bigimage2} alt="sample" />
    {records.map((record) => {
      return <div style={{margin: '4px 8px'}} key={record.$id.value}>
        <label>
          <input type="checkbox" onChange={checkboxHandler(record.$id.value)} checked={selectedIds.includes(record.$id.value)}/>
          <span style={{paddingLeft: '4px'}}>{record.会社名.value}</span>
        </label>
      </div>;
    })}
  </div>;
};


kintone.events.on('app.record.index.show', async (event) => {
  const records = event.records as KintoneTypes.SavedCustomer[];
  
  console.log("appIds取得")
  console.log({appIds:appIds})

  const targetEl = document.querySelector('#target');
  if (targetEl == null) return;
  // Componentを描画
  ReactDOM.render(<ChecklistComponent records={records} />, targetEl);
});