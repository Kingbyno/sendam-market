# Cleanup script to remove unnecessary documentation and verification files
Write-Host "Starting cleanup of unnecessary files..." -ForegroundColor Green

# Documentation and status markdown files to remove
$markdownFiles = @(
    "ADMIN_SETUP_GUIDE.md",
    "AUTHENTICATION_COMPLETE.md",
    "AUTHENTICATION_ERROR_MESSAGING_COMPLETE.md",
    "AUTHENTICATION_FINAL_STATUS.md",
    "AUTHENTICATION_FIXED.md",
    "AUTHENTICATION_STATUS.md",
    "CHAT_REMOVAL_COMPLETE_SUCCESS.md",
    "CHAT_REMOVAL_VERIFICATION.md",
    "CRITICAL_ISSUES_RESOLUTION_COMPLETE.md",
    "DELIVERY_DIALOG_ENHANCEMENT_COMPLETE.md",
    "DELIVERY_DIALOG_ENHANCEMENT_PROJECT_COMPLETE.md",
    "DELIVERY_DIALOG_MOBILE_OPTIMIZATION_COMPLETE.md",
    "DEPLOYMENT_CHECKLIST.md",
    "GOOGLE_OAUTH_FIX.md",
    "MARKETPLACE_ADMIN_ENHANCEMENT_COMPLETE.md",
    "MARKETPLACE_ENHANCEMENT_PROJECT_COMPLETE.md",
    "MARKETPLACE_UX_ENHANCEMENT_COMPLETE.md",
    "MOBILE_FOOTER_OPTIMIZATION_COMPLETE.md",
    "MOBILE_MARKETPLACE_OPTIMIZATION_COMPLETE.md",
    "PORT_3000_MIGRATION_COMPLETE.md",
    "PURCHASE_FOLDER_ANALYSIS_COMPLETE.md",
    "RESOLUTION_SUMMARY.md",
    "SELLER_DASHBOARD_IMPROVEMENTS_COMPLETE.md",
    "SELL_FORM_BLUE_THEME_COMPLETE.md",
    "SELL_FORM_DEBUG_STATUS.md",
    "SELL_FORM_READY_TO_TEST.md",
    "SELL_FORM_TEST_GUIDE.md",
    "SELL_FORM_VISIBILITY_ENHANCEMENT_COMPLETE.md",
    "SERVER_ACTION_ERROR_FIX_COMPLETE.md",
    "SUPABASE_CLEANUP_COMPLETE.md"
)

# Verification and test scripts to remove
$scriptFiles = @(
    "admin-dashboard-text-visibility-fix-complete.js",
    "chat-removal-complete.js",
    "chat-removal-final-verification.js",
    "chat-removal-status.js",
    "check-data.js",
    "create-enhanced-seller-items.js",
    "create-enhanced-test-items.js",
    "create-new-enhanced-items.js",
    "create-test-marketplace-items.js",
    "create-test-user.js",
    "critical-fixes-verification.js",
    "critical-issues-analysis.js",
    "delivery-dialog-enhancement-verification.js",
    "final-auth-status.js",
    "final-auth-test.js",
    "final-enhancement-verification.js",
    "final-marketplace-admin-completion.js",
    "item-card-text-visibility-fix-verification.js",
    "marketplace-ux-enhancements.js",
    "remove-chat-from-schema.js",
    "sell-form-blue-verification.js",
    "sell-form-visibility-verification.js",
    "seller-dashboard-fixes-complete.js",
    "test-action-fixes.js",
    "test-admin-fixes.js",
    "test-admin-functionality.js",
    "test-auth-config.js",
    "test-chat-removal.js",
    "test-error-messaging.js",
    "test-google-oauth.js",
    "test-hamburger-close-button-visibility.js",
    "test-hamburger-menu-visibility.js",
    "test-item-queries-fixed.js",
    "test-marketplace-improvements.js",
    "test-mobile-footer-optimization.js",
    "test-mobile-marketplace-enhancements.js",
    "test-port-config.js",
    "test-sell-flow.js",
    "test-sell-form-debug.js",
    "test-server-action-fix.js",
    "verify-chat-removal-success.js",
    "verify-port-3000.js"
)

$totalFilesRemoved = 0

# Remove markdown files
Write-Host "Removing documentation files..." -ForegroundColor Yellow
foreach ($file in $markdownFiles) {
    if (Test-Path $file) {
        Remove-Item $file -Force
        Write-Host "Removed: $file" -ForegroundColor Green
        $totalFilesRemoved++
    }
}

# Remove script files
Write-Host "Removing verification and test scripts..." -ForegroundColor Yellow
foreach ($file in $scriptFiles) {
    if (Test-Path $file) {
        Remove-Item $file -Force
        Write-Host "Removed: $file" -ForegroundColor Green
        $totalFilesRemoved++
    }
}

# Remove other temporary files
Write-Host "Removing other temporary files..." -ForegroundColor Yellow
$otherFiles = @(
    "update-schema.ps1",
    "start-server.bat",
    "sanity.config.js",
    "package-lock.json"
)

foreach ($file in $otherFiles) {
    if (Test-Path $file) {
        Remove-Item $file -Force
        Write-Host "Removed: $file" -ForegroundColor Green
        $totalFilesRemoved++
    }
}

Write-Host "Cleanup completed!" -ForegroundColor Green
Write-Host "Total files removed: $totalFilesRemoved" -ForegroundColor Cyan
Write-Host "Your workspace is now clean and organized!" -ForegroundColor Green
