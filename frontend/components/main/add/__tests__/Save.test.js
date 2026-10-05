// Test file for Save component character count feature
describe('Save.js - Character Count Feature', () => {
  test('charCount style exists with correct properties', () => {
    const fs = require('fs');
    const path = require('path');
    const saveFilePath = path.join(__dirname, '../Save.js');
    const fileContent = fs.readFileSync(saveFilePath, 'utf8');

    expect(fileContent).toContain('charCount:');
    expect(fileContent).toContain('fontSize: 12,');
    expect(fileContent).toContain("color: 'rgba(0,0,0,0.4)',");
    expect(fileContent).toContain("textAlign: 'right',");
    expect(fileContent).toContain('marginTop: 2,');
  });

  test('character count text element is rendered', () => {
    const fs = require('fs');
    const path = require('path');
    const saveFilePath = path.join(__dirname, '../Save.js');
    const fileContent = fs.readFileSync(saveFilePath, 'utf8');

    expect(fileContent).toContain('{caption.length} characters');
    expect(fileContent).toContain('styles.charCount');
  });

  test('caption state and setCaption handler exist', () => {
    const fs = require('fs');
    const path = require('path');
    const saveFilePath = path.join(__dirname, '../Save.js');
    const fileContent = fs.readFileSync(saveFilePath, 'utf8');

    expect(fileContent).toContain('useState("")');
    expect(fileContent).toContain('onChangeText={setCaption}');
  });

  test('character count is right-aligned and visually secondary', () => {
    const fs = require('fs');
    const path = require('path');
    const saveFilePath = path.join(__dirname, '../Save.js');
    const fileContent = fs.readFileSync(saveFilePath, 'utf8');

    expect(fileContent).toContain("color: 'rgba(0,0,0,0.4)'");
    expect(fileContent).toContain("textAlign: 'right'");
    expect(fileContent).toContain('fontSize: 12');
  });
});
