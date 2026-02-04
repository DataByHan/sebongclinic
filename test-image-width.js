// This script tests the image width functionality
// It will be run in the browser console

// First, let's check if the editor instance exists
console.log('Testing image width functionality...');

// Get the editor instance from the page
const editorInstance = window.editorInstance;
if (!editorInstance) {
  console.error('Editor instance not found');
} else {
  console.log('Editor instance found:', editorInstance);
  
  // Try to execute the setNoticeImageWidth command
  try {
    const result = editorInstance.exec('setNoticeImageWidth', { width: '300', unit: 'px' });
    console.log('Command execution result:', result);
  } catch (e) {
    console.error('Error executing command:', e);
  }
}
