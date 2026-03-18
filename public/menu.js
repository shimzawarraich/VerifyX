// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    
    // Get the play button
    const playBtn = document.getElementById('playBtn');
    
    // Add click event listener
    playBtn.addEventListener('click', function() {
        // Navigate to the levels page
        window.location.href = 'level.html';
    });
    
    // Optional: Add a cool transition effect when leaving
    playBtn.addEventListener('click', function(e) {
        e.preventDefault();
        
        // Add a fade-out effect to the body
        document.body.style.transition = 'opacity 0.5s ease';
        document.body.style.opacity = '0';
        
        // Navigate to the new page after the fade effect
        setTimeout(function() {
            window.location.href = 'level.html';
        }, 500);
    });
    
});

