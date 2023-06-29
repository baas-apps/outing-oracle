<!-- /+layout.svelte -->

<script>
  import "../app.css";
</script>

<div class="navbar bg-base-100">
    <div class="flex-1">
      <a class="btn btn-ghost normal-case text-xl">OutingOracle</a>
    </div>
    <div class="flex-none gap-2">
      <div class="dropdown dropdown-end">
        <html>
          <body>
              <script src="https://accounts.google.com/gsi/client" async defer></script>
              <div id="g_id_onload"
                 data-client_id="YOUR_GOOGLE_CLIENT_ID"
                 data-login_uri="https://your.domain/your_login_endpoint"
                 data-auto_prompt="false">
              </div>
              <div class="g_id_signin"
                 data-type="standard"
                 data-size="large"
                 data-theme="outline"
                 data-text="sign_in_with"
                 data-shape="rectangular"
                 data-logo_alignment="left">
              </div>
          </body>
        </html>
      </div>
    </div>
  </div>

<slot></slot>