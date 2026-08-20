package com.stockscorcher.app;

import android.content.ClipData;
import android.content.ClipboardManager;
import android.content.Context;
import android.content.Intent;
import android.graphics.Color;
import android.graphics.Typeface;
import android.graphics.drawable.GradientDrawable;
import android.net.Uri;
import android.os.Bundle;
import android.view.Gravity;
import android.view.View;
import android.view.ViewGroup;
import android.view.Window;
import android.widget.*;

import androidx.appcompat.app.AlertDialog;
import androidx.appcompat.app.AppCompatActivity;

import com.razorpay.Checkout;
import com.razorpay.PaymentData;
import com.razorpay.PaymentResultWithDataListener;

import org.json.JSONObject;

import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

public class MainActivity extends AppCompatActivity implements PaymentResultWithDataListener {
    private static final int BLACK = Color.rgb(3, 4, 6);
    private static final int SURFACE = Color.rgb(13, 14, 18);
    private static final int SURFACE_2 = Color.rgb(20, 21, 26);
    private static final int BORDER = Color.rgb(38, 39, 45);
    private static final int WHITE = Color.rgb(247, 247, 249);
    private static final int MUTED = Color.rgb(157, 159, 169);
    private static final int GOLD = Color.rgb(250, 204, 21);
    private static final int GREEN = Color.rgb(34, 197, 94);
    private static final int BLUE = Color.rgb(96, 165, 250);

    private ApiClient api;
    private final ExecutorService executor = Executors.newCachedThreadPool();
    private ViewGroup root;
    private FrameLayout content;
    private LinearLayout bottom;
    private boolean drawerOpen = false;
    private String currentScreen = "Auth";
    private long lastBackPressed = 0L;
    private String backScreen = "Home";
    private String pendingType, pendingId, pendingName;
    private int pendingOriginalPrice;

    private final Course[] courses = new Course[]{
            new Course("basic", "Trading PDF & Cheat Sheets", "Professional price-action notes, chart patterns and risk-management guides.", 999, "DIGITAL ASSET", GOLD, R.drawable.thumb_basic),
            new Course("premium", "Stock Scorcher Masterclass", "Complete institutional curriculum with recorded lessons and lifetime access.", 6999, "MOST POPULAR", GOLD, R.drawable.thumb_masterclass),
            new Course("pro-mentorship", "Pro Mentorship & Execution", "Strategic mentorship, live sessions and professional portfolio audits.", 9999, "ELITE ACCESS", GREEN, R.drawable.thumb_mentorship)
    };
    private final Membership[] memberships = new Membership[]{
            new Membership("Monthly", "AI trading toolkit for active traders with live terminal access.", 999, "MOST POPULAR", GOLD, R.drawable.thumb_monthly),
            new Membership("Yearly", "Maximum value for serious traders seeking long-term market edge.", 9999, "SAVE 17%", GREEN, R.drawable.thumb_yearly)
    };

    @Override public void onBackPressed() {
        if (drawerOpen) { closeDrawer(); return; }
        if ("Auth".equals(currentScreen)) {
            super.onBackPressed();
            return;
        }
        if (!"Home".equals(currentScreen)) {
            String target = backScreen == null || backScreen.isEmpty() ? "Home" : backScreen;
            if ("Profile".equals(target)) showProfile();
            else if ("My Course".equals(target)) showMyCourse();
            else if ("Membership".equals(target)) showMembership();
            else showHome();
            return;
        }
        long now = System.currentTimeMillis();
        if (now - lastBackPressed < 1800L) {
            super.onBackPressed();
        } else {
            lastBackPressed = now;
            Toast.makeText(this, "Press back again to exit", Toast.LENGTH_SHORT).show();
        }
    }

    @Override protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        Window w = getWindow();
        w.setStatusBarColor(BLACK);
        w.setNavigationBarColor(BLACK);
        if (android.os.Build.VERSION.SDK_INT >= 23) {
            w.getDecorView().setSystemUiVisibility(0);
        }
        if (android.os.Build.VERSION.SDK_INT >= 30) {
            w.setDecorFitsSystemWindows(true);
        }
        api = new ApiClient(this);
        Checkout.preload(getApplicationContext());
        if (!api.isLoggedIn()) showAuth(false); else showHome();
    }

    private void base(String active) {
        drawerOpen = false;
        String nextScreen = active == null ? "Home" : active;
        if (!"Auth".equals(currentScreen) && !currentScreen.equals(nextScreen)) backScreen = currentScreen;
        currentScreen = nextScreen;

        FrameLayout frame = new FrameLayout(this);
        frame.setBackgroundColor(BLACK);
        root = frame;
        setContentView(frame);

        LinearLayout shell = new LinearLayout(this);
        shell.setOrientation(LinearLayout.VERTICAL);
        shell.setBackgroundColor(BLACK);
        frame.addView(shell, new FrameLayout.LayoutParams(-1, -1));

        FrameLayout top = new FrameLayout(this);
        top.setPadding(dp(16), dp(8), dp(16), dp(8));
        top.setBackgroundColor(BLACK);
        shell.addView(top, new LinearLayout.LayoutParams(-1, dp(68)));

        TextView menu = iconButton("☰");
        FrameLayout.LayoutParams menuLp = new FrameLayout.LayoutParams(dp(46), dp(46), Gravity.START | Gravity.CENTER_VERTICAL);
        top.addView(menu, menuLp);
        menu.setOnClickListener(v -> toggleDrawer());

        ImageView logo = new ImageView(this);
        logo.setImageResource(R.drawable.stock_scorcher_logo);
        logo.setScaleType(ImageView.ScaleType.CENTER_INSIDE);
        FrameLayout.LayoutParams logoLp = new FrameLayout.LayoutParams(dp(52), dp(46), Gravity.CENTER);
        top.addView(logo, logoLp);

        TextView profile = iconButton("●");
        FrameLayout.LayoutParams profileLp = new FrameLayout.LayoutParams(dp(46), dp(46), Gravity.END | Gravity.CENTER_VERTICAL);
        top.addView(profile, profileLp);
        profile.setTextColor(GOLD);
        profile.setTextSize(16);
        profile.setOnClickListener(v -> showProfile());

        content = new FrameLayout(this);
        content.setBackgroundColor(BLACK);
        shell.addView(content, new LinearLayout.LayoutParams(-1, 0, 1));
        buildBottom(active);

        // Keep system bars outside the app content. This prevents the top bar and bottom bar
        // from being drawn underneath Android's status/navigation areas.
        if (android.os.Build.VERSION.SDK_INT >= 23) {
            frame.setSystemUiVisibility(0);
        }
    }

    private void buildBottom(String active) {
        bottom = new LinearLayout(this);
        bottom.setOrientation(LinearLayout.HORIZONTAL);
        bottom.setGravity(Gravity.CENTER);
        bottom.setPadding(dp(8), dp(7), dp(8), dp(8));
        bottom.setBackgroundColor(Color.rgb(8, 9, 11));
        bottom.setElevation(dp(10));
        String[] labels = {"Home", "My Course", "Membership", "Profile"};
        String[] icons = {"⌂", "▣", "♛", "●"};
        for (int i = 0; i < labels.length; i++) {
            final int idx = i;
            boolean selected = labels[i].equals(active);
            LinearLayout item = new LinearLayout(this);
            item.setOrientation(LinearLayout.VERTICAL);
            item.setGravity(Gravity.CENTER);
            item.setPadding(dp(2), dp(3), dp(2), dp(2));
            TextView ic = label(icons[i], 18, selected ? GOLD : MUTED);
            TextView tx = label(labels[i], 10, selected ? GOLD : MUTED);
            tx.setTypeface(Typeface.DEFAULT, Typeface.BOLD);
            item.addView(ic, new LinearLayout.LayoutParams(-1, dp(25)));
            item.addView(tx, new LinearLayout.LayoutParams(-1, dp(20)));
            item.setOnClickListener(v -> {
                if (idx == 0) showHome();
                else if (idx == 1) showMyCourse();
                else if (idx == 2) showMembership();
                else showProfile();
            });
            bottom.addView(item, new LinearLayout.LayoutParams(0, dp(56), 1));
        }
        root.addView(bottom, new LinearLayout.LayoutParams(-1, dp(72)));
    }

    private void showHome() {
        base("Home");
        LinearLayout p = page();

        p.addView(label("WELCOME BACK", 11, GOLD));
        TextView hello = title("Hello, " + displayName() + " 👋", 29);
        hello.setPadding(0, dp(3), 0, 0);
        p.addView(hello);
        p.addView(label("Your personal trading learning hub.", 14, MUTED));
        p.addView(space(18));

        // Featured slider.
        LinearLayout head = sectionRow("Featured for You", "All Courses", () -> showCourses());
        p.addView(head);
        HorizontalScrollView slider = new HorizontalScrollView(this);
        slider.setHorizontalScrollBarEnabled(false);
        slider.setClipToPadding(false);
        LinearLayout cards = new LinearLayout(this);
        cards.setPadding(0, dp(4), dp(14), dp(12));
        for (Course c : courses) cards.addView(courseCard(c, true), new LinearLayout.LayoutParams(dp(300), dp(292)));
        slider.addView(cards);
        p.addView(slider, new LinearLayout.LayoutParams(-1, dp(306)));

        LinearLayout actionRow = new LinearLayout(this);
        actionRow.setOrientation(LinearLayout.HORIZONTAL);
        Button all = primaryButton("All Courses");
        Button membership = secondaryButton("Membership");
        actionRow.addView(all, new LinearLayout.LayoutParams(0, dp(52), 1));
        LinearLayout.LayoutParams mp = new LinearLayout.LayoutParams(0, dp(52), 1);
        mp.setMargins(dp(10), 0, 0, 0);
        actionRow.addView(membership, mp);
        all.setOnClickListener(v -> showCourses());
        membership.setOnClickListener(v -> showMembership());
        p.addView(actionRow);

        p.addView(space(24));
        p.addView(sectionTitle("Your Access", "Quick status for courses and premium membership."));
        FrameLayout access = card();
        LinearLayout ai = inside();
        access.addView(ai);
        ai.addView(label("COURSE ACCESS", 10, GOLD));
        TextView courseStatus = title("Checking…", 18);
        ai.addView(courseStatus);
        ai.addView(space(4));
        Button courseBtn = secondaryButton("Open My Course");
        ai.addView(courseBtn, new LinearLayout.LayoutParams(-1, dp(48)));
        courseBtn.setOnClickListener(v -> showMyCourse());
        p.addView(access);

        p.addView(space(10));
        FrameLayout member = card();
        LinearLayout mi = inside();
        member.addView(mi);
        mi.addView(label("MEMBERSHIP", 10, GOLD));
        TextView memberStatus = title("Checking…", 18);
        mi.addView(memberStatus);
        mi.addView(space(4));
        Button memberBtn = secondaryButton("Open Membership");
        mi.addView(memberBtn, new LinearLayout.LayoutParams(-1, dp(48)));
        memberBtn.setOnClickListener(v -> showMembership());
        p.addView(member);

        p.addView(space(24));
        p.addView(sectionTitle("Explore", "Blog, reviews, founder story and support."));
        String[] quick = {"Blog", "About", "Reviews", "FAQ"};
        for (String q : quick) {
            Button b = secondaryButton(q + "  ›");
            p.addView(b, new LinearLayout.LayoutParams(-1, dp(50)));
            b.setOnClickListener(v -> showInfo(q));
            p.addView(space(8));
        }
        Button more = primaryButton("More  ·  Contact · Refer & Earn");
        p.addView(more, new LinearLayout.LayoutParams(-1, dp(52)));
        more.setOnClickListener(v -> showMore());

        p.addView(space(24));
        p.addView(sectionTitle("Follow Us", "Stay connected with Stock Scorcher."));
        LinearLayout social = new LinearLayout(this);
        social.setOrientation(LinearLayout.HORIZONTAL);
        String[] socials = {"Instagram", "YouTube", "Telegram"};
        for (String s : socials) {
            Button b = secondaryButton(s);
            LinearLayout.LayoutParams sp = new LinearLayout.LayoutParams(0, dp(48), 1);
            sp.setMargins(0, 0, dp(7), 0);
            social.addView(b, sp);
            b.setOnClickListener(v -> openSocial(s));
        }
        p.addView(social);
        p.addView(space(14));
        TextView footer = label("Stock Scorcher  •  Trade with a plan, not emotion.", 11, MUTED);
        footer.setGravity(Gravity.CENTER);
        p.addView(footer, new LinearLayout.LayoutParams(-1, dp(36)));

        content.addView(scroll(p));
        refreshAccess(courseStatus, memberStatus);
    }

    private void showCourses() {
        base("My Course");
        LinearLayout p = page();
        p.addView(title("All Courses", 30));
        p.addView(label("Pick your learning path. Course ownership is synced to your account.", 14, MUTED));
        p.addView(space(18));
        for (Course c : courses) {
            p.addView(courseCard(c, false));
            p.addView(space(12));
        }
        content.addView(scroll(p));
    }

    private void showMembership() {
        base("Membership");
        LinearLayout p = page();
        p.addView(title("Membership", 30));
        p.addView(label("Premium market tools, signals and private access.", 14, MUTED));
        p.addView(space(16));

        FrameLayout status = card();
        LinearLayout si = inside();
        status.addView(si);
        si.addView(label("YOUR PLAN", 10, GOLD));
        TextView sh = title("Checking membership…", 19);
        TextView sd = label("", 13, MUTED);
        si.addView(sh); si.addView(sd); si.addView(space(8));
        Button dash = secondaryButton("Open Membership Dashboard");
        dash.setVisibility(View.GONE);
        si.addView(dash, new LinearLayout.LayoutParams(-1, dp(48)));
        dash.setOnClickListener(v -> showMemberDashboard());
        p.addView(status); p.addView(space(12));

        for (Membership m : memberships) {
            p.addView(membershipCard(m));
            p.addView(space(12));
        }
        content.addView(scroll(p));

        run(() -> {
            try {
                JSONObject doc = api.readMembership();
                String st = ApiClient.fieldString(doc, "status");
                String plan = ApiClient.fieldString(doc, "plan");
                String exp = ApiClient.fieldString(doc, "expiryDate");
                runUi(() -> {
                    if (ApiClient.hasActiveMembership(doc)) {
                        sh.setText("VIP Membership Active");
                        sd.setText((plan.isEmpty() ? "Premium Access" : plan) + (exp.isEmpty() ? "" : "  •  expires " + exp.substring(0, Math.min(10, exp.length()))));
                        dash.setVisibility(View.VISIBLE);
                    } else {
                        sh.setText("No Active Membership");
                        sd.setText("Choose a plan below to unlock premium access.");
                    }
                });
            } catch (Exception e) {
                runUi(() -> { sh.setText("No Active Membership"); sd.setText("Choose a plan below to unlock premium access."); });
            }
        });
    }

    private void showMemberDashboard() {
        String parent = currentScreen;
        base("Membership");
        backScreen = parent.equals("Membership") ? "Membership" : "Home";
        currentScreen = "MembershipDashboard";
        LinearLayout p = page();
        p.addView(title("Membership Dashboard", 30));
        p.addView(label("Your premium access at a glance.", 14, MUTED));
        p.addView(space(16));
        FrameLayout hero = card();
        LinearLayout hi = inside();
        hero.addView(hi);
        hi.addView(label("VIP ACCESS", 10, GOLD));
        TextView plan = title("Loading…", 25);
        TextView expiry = label("", 13, MUTED);
        hi.addView(plan); hi.addView(expiry);
        p.addView(hero); p.addView(space(12));

        String[] features = {"AI Buy / Sell Signals", "Real-time Paper Trading Terminal", "Advanced Portfolio Tracker", "Unlimited Custom Watchlists", "Private VIP Community", "Priority Technical Support", "Instant Market Alerts"};
        for (String f : features) {
            FrameLayout x = card();
            LinearLayout xi = inside(); x.addView(xi);
            TextView check = title("✓  " + f, 15);
            check.setTextColor(WHITE);
            xi.addView(check);
            p.addView(x); p.addView(space(7));
        }
        content.addView(scroll(p));
        run(() -> {
            try {
                JSONObject d = api.readMembership();
                String pl = ApiClient.fieldString(d, "plan");
                String ex = ApiClient.membershipExpiry(d);
                runUi(() -> { plan.setText(pl.isEmpty() ? "VIP Membership" : pl + " Membership"); expiry.setText(ex.isEmpty() ? "Active access" : "Active until " + ex.substring(0, Math.min(10, ex.length()))); });
            } catch (Exception ignored) { }
        });
    }

    private void showMyCourse() {
        base("My Course");
        LinearLayout p = page();
        p.addView(title("My Course", 30));
        p.addView(label("Your purchased learning access, synced with your Stock Scorcher account.", 14, MUTED));
        p.addView(space(16));

        FrameLayout c = card(); LinearLayout i = inside(); c.addView(i);
        i.addView(label("COURSE ACCESS", 10, GOLD));
        TextView h = title("Loading…", 21); TextView d = label("", 13, MUTED);
        i.addView(h); i.addView(d); i.addView(space(10));
        Button b = primaryButton("Open Learning Area");
        i.addView(b, new LinearLayout.LayoutParams(-1, dp(52)));
        b.setOnClickListener(v -> showMessage("Learning Area", "Your course access is active. Course modules can be opened here when they are published to your account."));
        p.addView(c);
        p.addView(space(18));
        p.addView(sectionTitle("Need a course?", "Choose from the three available learning paths."));
        Button browse = secondaryButton("Browse All Courses");
        p.addView(browse, new LinearLayout.LayoutParams(-1, dp(50)));
        browse.setOnClickListener(v -> showCourses());
        content.addView(scroll(p));

        run(() -> {
            try {
                JSONObject doc = api.readPurchase();
                String plan = ApiClient.purchaseName(doc);
                boolean purchased = ApiClient.hasCoursePurchase(doc);
                runUi(() -> {
                    if (!purchased) {
                        h.setText("Not Purchased");
                        d.setText("No course is linked to this account yet.");
                        b.setText("Browse Courses");
                        b.setOnClickListener(v -> showCourses());
                    } else {
                        h.setText(plan.isEmpty() ? "Course Access" : plan);
                        d.setText("Purchased  •  Paid  •  Synced");
                        b.setText("Open Learning Area");
                    }
                });
            } catch (Exception e) {
                runUi(() -> { h.setText("Unable to load purchase"); d.setText("Check your connection and try again."); });
            }
        });
    }

    private void showProfile() {
        base("Profile");
        LinearLayout p = page();
        p.addView(title("Profile", 30));
        p.addView(label("Your Stock Scorcher account", 14, MUTED));
        p.addView(space(16));

        FrameLayout profileCard = card(); LinearLayout pi = inside(); profileCard.addView(pi);
        TextView avatar = label(initials(displayName()), 24, Color.BLACK);
        avatar.setGravity(Gravity.CENTER);
        avatar.setTypeface(Typeface.DEFAULT, Typeface.BOLD);
        avatar.setBackground(round(GOLD, 50));
        pi.addView(avatar, new LinearLayout.LayoutParams(dp(62), dp(62)));
        pi.addView(space(10));
        pi.addView(title(displayName(), 22));
        pi.addView(label(api.getEmail(), 13, MUTED));
        p.addView(profileCard); p.addView(space(12));
        Button edit = primaryButton("Edit Profile");
        p.addView(edit, new LinearLayout.LayoutParams(-1, dp(52)));
        edit.setOnClickListener(v -> showEditProfile());
        p.addView(space(14));

        String[] actions = {"Purchase History", "Chat Support", "Refer & Earn", "Rate the App", "Share App", "Logout"};
        for (String a : actions) {
            Button b = a.equals("Logout") ? dangerButton(a) : secondaryButton(a);
            p.addView(b, new LinearLayout.LayoutParams(-1, dp(52)));
            p.addView(space(8));
            b.setOnClickListener(v -> {
                if (a.equals("Purchase History")) showMyCourse();
                else if (a.equals("Chat Support")) showInfo("Contact Us");
                else if (a.equals("Refer & Earn")) showInfo("Refer & Earn");
                else if (a.equals("Rate the App")) showMessage("Rate Stock Scorcher", "Thank you for supporting the app. The Play Store rating flow can be enabled after publishing.");
                else if (a.equals("Share App")) shareApp();
                else { api.logout(); showAuth(false); }
            });
        }
        content.addView(scroll(p));
    }

    private void showEditProfile() {
        LinearLayout box = dialogBox();
        box.addView(label("PROFILE", 10, GOLD));
        box.addView(title("Edit Profile", 24));
        box.addView(space(10));
        EditText name = input("Your name");
        name.setText(displayName());
        name.setSelection(name.length());
        box.addView(name, new LinearLayout.LayoutParams(-1, dp(54)));
        box.addView(space(10));
        box.addView(label("Email", 12, MUTED));
        box.addView(label(api.getEmail(), 14, WHITE));
        box.addView(space(14));
        Button save = primaryButton("Save Changes");
        Button cancel = secondaryButton("Cancel");
        box.addView(save, new LinearLayout.LayoutParams(-1, dp(52)));
        box.addView(space(8));
        box.addView(cancel, new LinearLayout.LayoutParams(-1, dp(52)));
        PopupWindow pw = popup(box);
        save.setOnClickListener(v -> {
            String newName = name.getText().toString().trim();
            if (newName.length() < 2) { showMessage("Invalid name", "Please enter your name."); return; }
            save.setEnabled(false);
            run(() -> {
                try {
                    api.updateProfile(newName);
                    runUi(() -> { pw.dismiss(); showMessage("Profile Updated", "Your profile has been updated successfully."); showProfile(); });
                } catch (Exception e) {
                    runUi(() -> { save.setEnabled(true); showMessage("Update Failed", e.getMessage()); });
                }
            });
        });
        cancel.setOnClickListener(v -> pw.dismiss());
        pw.showAtLocation(root, Gravity.CENTER, 0, 0);
    }

    private void showMore() {
        base("Home");
        LinearLayout p = page();
        p.addView(title("More", 30));
        p.addView(label("Everything outside your main learning dashboard.", 14, MUTED));
        p.addView(space(16));
        String[] items = {"Blog", "About", "Reviews", "FAQ", "Contact Us", "Refer & Earn"};
        for (String item : items) {
            Button b = secondaryButton(item + "  ›");
            p.addView(b, new LinearLayout.LayoutParams(-1, dp(54)));
            b.setOnClickListener(v -> showInfo(item));
            p.addView(space(9));
        }
        content.addView(scroll(p));
    }

    private void showInfo(String what) {
        base("Home");
        LinearLayout p = page();
        p.addView(title(what, 30));
        p.addView(space(8));
        if ("About".equals(what)) {
            ImageView im = new ImageView(this);
            im.setImageResource(R.drawable.founder);
            im.setScaleType(ImageView.ScaleType.CENTER_CROP);
            p.addView(im, new LinearLayout.LayoutParams(-1, dp(230)));
            p.addView(space(14));
            p.addView(label("Stock Scorcher is a trading education and market-tools platform founded by Aman Lohar. The Android app is intentionally a separate mobile experience while sharing the same account, course ownership, membership and payment records.", 15, WHITE));
        } else if ("Refer & Earn".equals(what)) {
            p.addView(label("Share your referral link and grow with Stock Scorcher.", 15, WHITE));
            String uid = api.getUid() == null ? "USER" : api.getUid();
            String shortUid = uid.substring(0, Math.min(6, uid.length()));
            String link = "https://stockscorcher.com/?ref=ELITE_" + shortUid;
            TextView code = label(link, 13, GOLD);
            code.setPadding(dp(16), dp(17), dp(16), dp(17));
            code.setBackground(round(SURFACE_2, 16));
            p.addView(space(12)); p.addView(code);
            Button copy = primaryButton("Copy Referral Link");
            p.addView(copy, new LinearLayout.LayoutParams(-1, dp(52)));
            copy.setOnClickListener(v -> { ClipboardManager cm = (ClipboardManager)getSystemService(CLIPBOARD_SERVICE); cm.setPrimaryClip(ClipData.newPlainText("Referral", link)); showMessage("Copied", "Referral link copied to clipboard."); });
        } else if ("Blog".equals(what)) {
            p.addView(label("Latest trading psychology, price action and market insights.", 15, MUTED));
            content.addView(scroll(p));
            run(() -> {
                try {
                    org.json.JSONArray blogs = api.getFirestoreCollection("blogs");
                    runUi(() -> {
                        for (int i = 0; i < blogs.length(); i++) {
                            try {
                                JSONObject doc = blogs.getJSONObject(i);
                                String t = ApiClient.fieldString(doc, "title");
                                String cat = ApiClient.fieldString(doc, "category");
                                String desc = ApiClient.fieldString(doc, "description").replaceAll("<[^>]*>", "");
                                FrameLayout c = card(); LinearLayout in = inside(); c.addView(in);
                                in.addView(label(cat.isEmpty() ? "MARKET INSIGHT" : cat.toUpperCase(), 10, GOLD));
                                in.addView(title(t.isEmpty() ? "Trading Insight" : t, 18));
                                if (!desc.isEmpty()) in.addView(label(desc, 12, MUTED));
                                p.addView(space(9)); p.addView(c);
                            } catch (Exception ignored) { }
                        }
                    });
                } catch (Exception ignored) { }
            });
            return;
        } else if ("Reviews".equals(what)) {
            p.addView(review("Manish Patel", "Aman sir's price action course completely changed my trading style."));
            p.addView(review("Priya Verma", "The AI signals and chart pattern modules are top-notch."));
            p.addView(review("Vikram Rathore", "Clean interface, genuine mentorship, and powerful tools."));
        } else if ("FAQ".equals(what)) {
            faq(p, "How do purchases work?", "Payments are processed securely and your verified purchase is saved to your Stock Scorcher account.");
            faq(p, "Will app and website access match?", "Yes. The mobile UI is separate, while account, course ownership and membership records stay synced.");
            faq(p, "What if payment succeeds but access is missing?", "Refresh the app after verification and contact support if the purchase still does not appear.");
        } else if ("Contact Us".equals(what)) {
            p.addView(label("Need help with your account, course or membership? Our support team can help.", 15, WHITE));
            p.addView(space(16));
            Button wa = primaryButton("Open WhatsApp Support");
            p.addView(wa, new LinearLayout.LayoutParams(-1, dp(54)));
            wa.setOnClickListener(v -> openUrl("https://wa.me/message/GWDVWEYHKZ63G1"));
        }
        content.addView(scroll(p));
    }

    private FrameLayout courseCard(Course c, boolean compact) {
        FrameLayout card = card();
        LinearLayout i = inside(); card.addView(i);
        ImageView thumb = new ImageView(this);
        thumb.setImageResource(c.image); thumb.setScaleType(ImageView.ScaleType.CENTER_CROP);
        i.addView(thumb, new LinearLayout.LayoutParams(-1, compact ? dp(126) : dp(165)));
        i.addView(space(10));
        TextView badge = label(c.badge, 10, c.accent); badge.setTypeface(Typeface.DEFAULT, Typeface.BOLD); i.addView(badge);
        i.addView(title(c.name, compact ? 19 : 22));
        i.addView(space(4));
        i.addView(label(c.description, 12, MUTED));
        i.addView(space(9));
        i.addView(title("₹" + c.price, 22));
        Button b = primaryButton("View Price & Details");
        i.addView(b, new LinearLayout.LayoutParams(-1, dp(48)));
        b.setOnClickListener(v -> showPurchaseDialog(c));
        return card;
    }

    private FrameLayout membershipCard(Membership m) {
        FrameLayout card = card(); LinearLayout i = inside(); card.addView(i);
        ImageView thumb = new ImageView(this); thumb.setImageResource(m.image); thumb.setScaleType(ImageView.ScaleType.CENTER_CROP);
        i.addView(thumb, new LinearLayout.LayoutParams(-1, dp(160)));
        i.addView(space(10));
        i.addView(label(m.badge, 10, m.accent));
        i.addView(title(m.plan + " Membership", 23));
        i.addView(label(m.description, 13, MUTED));
        i.addView(space(9));
        i.addView(title("₹" + m.price + (m.plan.equals("Monthly") ? " / month" : " / year"), 24));
        i.addView(space(8));
        String[] f = {"AI Buy / Sell Signals", "Paper Trading Terminal", "Advanced Portfolio Tracker", "Unlimited Watchlists", "Private VIP Community", "Market Alerts"};
        for (String x : f) i.addView(label("✓  " + x, 13, WHITE));
        i.addView(space(10));
        Button b = primaryButton("View Plan & Price"); i.addView(b, new LinearLayout.LayoutParams(-1, dp(50)));
        b.setOnClickListener(v -> showMembershipDialog(m));
        return card;
    }

    private void showPurchaseDialog(Course c) {
        LinearLayout box = dialogBox();
        box.addView(label("COURSE", 10, GOLD));
        box.addView(title(c.name, 23));
        box.addView(space(5));
        box.addView(label(c.description, 14, MUTED));
        box.addView(space(12));
        box.addView(title("₹" + c.price, 30));
        box.addView(label("One-time purchase • synced to your account", 12, MUTED));
        box.addView(space(10));
        Button buy = primaryButton("Purchase Now"); box.addView(buy, new LinearLayout.LayoutParams(-1, dp(52)));
        Button cancel = secondaryButton("Cancel"); box.addView(cancel, new LinearLayout.LayoutParams(-1, dp(52)));
        PopupWindow pw = popup(box);
        buy.setOnClickListener(v -> { pw.dismiss(); startPayment("course", c.id, c.name, c.price); });
        cancel.setOnClickListener(v -> pw.dismiss());
        pw.showAtLocation(root, Gravity.CENTER, 0, 0);
    }

    private void showMembershipDialog(Membership m) {
        LinearLayout box = dialogBox();
        box.addView(label("MEMBERSHIP", 10, GOLD));
        box.addView(title(m.plan + " Membership", 23));
        box.addView(space(5));
        box.addView(label(m.description, 14, MUTED));
        box.addView(space(12));
        box.addView(title("₹" + m.price, 30));
        box.addView(label(m.plan.equals("Monthly") ? "Monthly premium access" : "Annual premium access", 12, MUTED));
        box.addView(space(10));
        Button buy = primaryButton("Purchase Membership"); box.addView(buy, new LinearLayout.LayoutParams(-1, dp(52)));
        Button cancel = secondaryButton("Cancel"); box.addView(cancel, new LinearLayout.LayoutParams(-1, dp(52)));
        PopupWindow pw = popup(box);
        buy.setOnClickListener(v -> { pw.dismiss(); startPayment("membership", m.plan, m.plan + " Membership", m.price); });
        cancel.setOnClickListener(v -> pw.dismiss());
        pw.showAtLocation(root, Gravity.CENTER, 0, 0);
    }

    private void startPayment(String type, String id, String name, int price) {
        if (!api.isLoggedIn()) { showAuth(true); return; }
        pendingType = type; pendingId = id; pendingName = name; pendingOriginalPrice = price;
        showMessage("Preparing payment", "Creating a secure Razorpay order…");
        run(() -> {
            try {
                JSONObject order = api.createOrder(price);
                String orderId = order.optString("id");
                int amount = order.optInt("amount", price * 100);
                runUi(() -> openRazorpay(orderId, amount, name));
            } catch (Exception e) { runUi(() -> showMessage("Payment Error", e.getMessage())); }
        });
    }

    private void openRazorpay(String orderId, int amount, String name) {
        try {
            Checkout checkout = new Checkout();
            checkout.setKeyID("rzp_live_TB6ROKtV9GwMGv");
            JSONObject o = new JSONObject();
            o.put("name", "Stock Scorcher");
            o.put("description", name);
            o.put("order_id", orderId);
            o.put("currency", "INR");
            o.put("amount", amount);
            JSONObject pre = new JSONObject();
            pre.put("name", displayName()); pre.put("email", api.getEmail());
            o.put("prefill", pre);
            JSONObject theme = new JSONObject(); theme.put("color", "#facc15"); o.put("theme", theme);
            checkout.open(this, o);
        } catch (Exception e) { showMessage("Payment Error", e.getMessage()); }
    }

    @Override public void onPaymentSuccess(String paymentId, PaymentData paymentData) {
        String orderId = paymentData != null ? paymentData.getOrderId() : "";
        String signature = paymentData != null ? paymentData.getSignature() : "";
        verifyAndSave(paymentId, orderId, signature);
    }

    @Override public void onPaymentError(int code, String response, PaymentData paymentData) {
        showMessage("Payment Cancelled", "No payment was recorded. You can try again anytime.");
    }

    private void verifyAndSave(String paymentId, String orderId, String signature) {
        run(() -> {
            try {
                boolean ok = api.verifyPayment(orderId, paymentId, signature, pendingOriginalPrice, null);
                if (!ok) throw new Exception("Payment verification failed.");
                if ("course".equals(pendingType)) api.saveCoursePurchase(pendingId, pendingName, pendingOriginalPrice, pendingOriginalPrice, paymentId, orderId);
                else api.saveMembership(pendingId, pendingOriginalPrice, pendingOriginalPrice, paymentId, orderId);
                runUi(() -> { showMessage("Payment Successful", "Your purchase is verified and synced to your Stock Scorcher account."); showHome(); });
            } catch (Exception e) { runUi(() -> showMessage("Verification Failed", e.getMessage())); }
        });
    }

    private void refreshAccess(TextView courseStatus, TextView memberStatus) {
        run(() -> {
            try {
                JSONObject p = api.readPurchase(); JSONObject m = api.readMembership();
                String plan = ApiClient.purchaseName(p);
                boolean purchased = ApiClient.hasCoursePurchase(p);
                boolean memberActive = ApiClient.hasActiveMembership(m);
                String mp = ApiClient.fieldString(m, "plan");
                runUi(() -> {
                    courseStatus.setText(purchased ? "Purchased  •  " + (plan.isEmpty() ? "Course Access" : plan) : "Not Purchased");
                    memberStatus.setText(memberActive ? "Active  •  " + (mp.isEmpty() ? "VIP Membership" : mp) : "Not Purchased");
                });
            } catch (Exception e) { runUi(() -> { courseStatus.setText("Unable to check course status"); memberStatus.setText("Unable to check membership status"); }); }
        });
    }

    private void showAuth(boolean fromPurchase) {
        currentScreen = "Auth";
        LinearLayout authRoot = new LinearLayout(this);
        authRoot.setOrientation(LinearLayout.VERTICAL);
        authRoot.setGravity(Gravity.CENTER_HORIZONTAL);
        authRoot.setBackgroundColor(BLACK);
        authRoot.setPadding(dp(24), dp(28), dp(24), dp(28));
        setContentView(authRoot);

        ScrollView sc = new ScrollView(this); sc.setFillViewport(true);
        LinearLayout p = new LinearLayout(this); p.setOrientation(LinearLayout.VERTICAL); p.setGravity(Gravity.CENTER_HORIZONTAL);
        sc.addView(p); authRoot.addView(sc, new LinearLayout.LayoutParams(-1, -1));

        ImageView logo = new ImageView(this); logo.setImageResource(R.drawable.stock_scorcher_logo); logo.setScaleType(ImageView.ScaleType.CENTER_INSIDE);
        p.addView(logo, new LinearLayout.LayoutParams(-1, dp(86)));
        TextView h = title("Welcome to Stock Scorcher", 28); h.setGravity(Gravity.CENTER); p.addView(h);
        TextView sub = label(fromPurchase ? "Login to continue with your purchase." : "Your professional trading companion.", 14, MUTED); sub.setGravity(Gravity.CENTER); p.addView(sub);
        p.addView(space(20));

        EditText name = input("Name (for new account)"); EditText email = input("Email"); EditText pass = input("Password"); pass.setInputType(0x81);
        p.addView(name, new LinearLayout.LayoutParams(-1, dp(54))); p.addView(space(9));
        p.addView(email, new LinearLayout.LayoutParams(-1, dp(54))); p.addView(space(9));
        p.addView(pass, new LinearLayout.LayoutParams(-1, dp(54))); p.addView(space(12));
        Button login = primaryButton("Login"); Button signup = secondaryButton("Create Account"); Button forgot = secondaryButton("Forgot Password");
        p.addView(login, new LinearLayout.LayoutParams(-1, dp(54))); p.addView(space(8));
        p.addView(signup, new LinearLayout.LayoutParams(-1, dp(54))); p.addView(space(8));
        p.addView(forgot, new LinearLayout.LayoutParams(-1, dp(54)));
        login.setOnClickListener(v -> authAction(false, name, email, pass));
        signup.setOnClickListener(v -> authAction(true, name, email, pass));
        forgot.setOnClickListener(v -> run(() -> { try { api.resetPassword(email.getText().toString().trim()); runUi(() -> showMessage("Email Sent", "Password reset instructions have been sent if the email is registered.")); } catch(Exception e) { runUi(() -> showMessage("Reset Failed", e.getMessage())); } }));
    }

    private void authAction(boolean create, EditText name, EditText email, EditText pass) {
        String e = email.getText().toString().trim(), p = pass.getText().toString();
        if (e.isEmpty() || p.length() < 6) { showMessage("Check details", "Enter a valid email and a password of at least 6 characters."); return; }
        run(() -> {
            try { if (create) api.register(name.getText().toString().trim(), e, p); else api.login(e, p); runUi(this::showHome); }
            catch (Exception ex) { runUi(() -> showMessage("Login Failed", ex.getMessage())); }
        });
    }

    private void toggleDrawer() {
        if (drawerOpen) { closeDrawer(); return; }
        drawerOpen = true;
        FrameLayout overlay = new FrameLayout(this);
        overlay.setTag("drawer"); overlay.setBackgroundColor(Color.argb(175, 0, 0, 0));
        overlay.setClickable(true);
        overlay.setOnClickListener(v -> closeDrawer());
        FrameLayout panel = new FrameLayout(this);
        panel.setBackgroundColor(Color.rgb(8, 9, 12));
        panel.setClickable(true);
        panel.setOnClickListener(v -> { /* keep taps inside the drawer */ });
        panel.setElevation(dp(18));
        int width = Math.min(dp(340), (int)(getResources().getDisplayMetrics().widthPixels * .86f));
        FrameLayout.LayoutParams pp = new FrameLayout.LayoutParams(width, -1, Gravity.START);
        overlay.addView(panel, pp);
        LinearLayout p = new LinearLayout(this); p.setOrientation(LinearLayout.VERTICAL); p.setPadding(dp(20), dp(18), dp(18), dp(18));
        ScrollView sv = new ScrollView(this); sv.addView(p); panel.addView(sv, new FrameLayout.LayoutParams(-1, -1));

        LinearLayout head = new LinearLayout(this); head.setOrientation(LinearLayout.HORIZONTAL); head.setGravity(Gravity.CENTER_VERTICAL);
        ImageView logo = new ImageView(this); logo.setImageResource(R.drawable.stock_scorcher_logo); logo.setScaleType(ImageView.ScaleType.CENTER_INSIDE);
        head.addView(logo, new LinearLayout.LayoutParams(dp(52), dp(52)));
        LinearLayout user = new LinearLayout(this); user.setOrientation(LinearLayout.VERTICAL); user.setPadding(dp(12), 0, 0, 0);
        user.addView(title(displayName(), 18)); user.addView(label(api.getEmail(), 11, MUTED)); head.addView(user, new LinearLayout.LayoutParams(0, dp(60), 1));
        p.addView(head); p.addView(space(18));
        String[] items = {"Home", "Profile", "Purchase", "Chat", "Refer & Earn", "Rate", "Share", "Logout"};
        for (String x : items) {
            Button b = x.equals("Logout") ? dangerButton(x) : secondaryButton(x);
            p.addView(b, new LinearLayout.LayoutParams(-1, dp(50))); p.addView(space(7));
            b.setOnClickListener(v -> { closeDrawer(); if (x.equals("Home")) showHome(); else if (x.equals("Profile")) showProfile(); else if (x.equals("Purchase")) showMyCourse(); else if (x.equals("Refer & Earn")) showInfo(x); else if (x.equals("Chat")) showInfo("Contact Us"); else if (x.equals("Rate")) showMessage("Rate Stock Scorcher", "Thank you for supporting the app."); else if (x.equals("Share")) shareApp(); else { api.logout(); showAuth(false); } });
        }
        p.addView(space(12)); p.addView(label("FOLLOW US", 10, MUTED));
        String[] social = {"Instagram", "YouTube", "Telegram"};
        for (String s : social) { TextView t = label("•  " + s, 14, WHITE); t.setPadding(dp(4), dp(10), 0, dp(10)); p.addView(t); t.setOnClickListener(v -> openSocial(s)); }
        FrameLayout.LayoutParams overlayLp = new FrameLayout.LayoutParams(-1, -1);
        root.addView(overlay, overlayLp);
        overlay.bringToFront();
        panel.bringToFront();
    }

    private void closeDrawer() { View v = root == null ? null : root.findViewWithTag("drawer"); if (v != null) root.removeView(v); drawerOpen = false; }

    private void shareApp() { Intent i = new Intent(Intent.ACTION_SEND); i.setType("text/plain"); i.putExtra(Intent.EXTRA_TEXT, "Join me on Stock Scorcher — https://stockscorcher.com"); startActivity(Intent.createChooser(i, "Share Stock Scorcher")); }
    private void openSocial(String s) { if ("Instagram".equals(s)) openUrl("https://www.instagram.com/stockscorcher_official/"); else if ("YouTube".equals(s)) openUrl("https://youtube.com/@stockscorcherofficial"); else openUrl("https://t.me/stockscorcher"); }
    private void openUrl(String u) { try { startActivity(new Intent(Intent.ACTION_VIEW, Uri.parse(u))); } catch(Exception e) { showMessage("Unable to open link", u); } }

    private LinearLayout page() { LinearLayout p = new LinearLayout(this); p.setOrientation(LinearLayout.VERTICAL); p.setPadding(dp(18), dp(14), dp(18), dp(34)); return p; }
    private ScrollView scroll(View v) { ScrollView s = new ScrollView(this); s.setFillViewport(true); s.setClipToPadding(false); s.setPadding(0, 0, 0, dp(2)); s.addView(v); return s; }
    private FrameLayout card() { FrameLayout f = new FrameLayout(this); f.setBackground(round(SURFACE, 22)); f.setPadding(dp(15), dp(15), dp(15), dp(15)); return f; }
    private LinearLayout inside() { LinearLayout l = new LinearLayout(this); l.setOrientation(LinearLayout.VERTICAL); return l; }
    private LinearLayout dialogBox() { LinearLayout l = inside(); l.setPadding(dp(22), dp(22), dp(22), dp(22)); l.setBackground(round(Color.rgb(12, 13, 16), 24)); return l; }
    private PopupWindow popup(View v) { PopupWindow p = new PopupWindow(v, Math.min(dp(350), (int)(getResources().getDisplayMetrics().widthPixels * .88f)), -2, true); p.setBackgroundDrawable(round(Color.TRANSPARENT, 20)); p.setElevation(dp(20)); return p; }
    private GradientDrawable round(int color, float r) { GradientDrawable g = new GradientDrawable(); g.setColor(color); g.setCornerRadius(dp((int)r)); g.setStroke(dp(1), BORDER); return g; }
    private Button primaryButton(String text) { Button b = new Button(this); b.setText(text); b.setTextColor(Color.BLACK); b.setTextSize(13); b.setAllCaps(false); b.setTypeface(Typeface.DEFAULT, Typeface.BOLD); b.setGravity(Gravity.CENTER); b.setMinHeight(0); b.setPadding(dp(12), 0, dp(12), 0); b.setBackground(round(GOLD, 16)); return b; }
    private Button secondaryButton(String text) { Button b = new Button(this); b.setText(text); b.setTextColor(WHITE); b.setTextSize(13); b.setAllCaps(false); b.setGravity(Gravity.CENTER_VERTICAL | Gravity.START); b.setPadding(dp(16), 0, dp(16), 0); b.setMinHeight(0); b.setBackground(round(SURFACE_2, 16)); return b; }
    private Button dangerButton(String text) { Button b = secondaryButton(text); b.setTextColor(Color.rgb(248, 113, 113)); return b; }
    private EditText input(String hint) { EditText e = new EditText(this); e.setHint(hint); e.setHintTextColor(MUTED); e.setTextColor(WHITE); e.setTextSize(14); e.setSingleLine(true); e.setPadding(dp(16), 0, dp(16), 0); e.setBackground(round(SURFACE_2, 16)); return e; }
    private TextView label(String t, float s, int c) { TextView v = new TextView(this); v.setText(t); v.setTextColor(c); v.setTextSize(s); return v; }
    private TextView title(String t, float s) { TextView v = label(t, s, WHITE); v.setTypeface(Typeface.DEFAULT, Typeface.BOLD); v.setPadding(0, dp(2), 0, dp(2)); return v; }
    private TextView iconButton(String t) { TextView v = label(t, 22, WHITE); v.setGravity(Gravity.CENTER); v.setBackground(round(SURFACE_2, 16)); return v; }
    private LinearLayout sectionRow(String heading, String action, Runnable click) { LinearLayout row = new LinearLayout(this); row.setGravity(Gravity.CENTER_VERTICAL); TextView h = title(heading, 20); row.addView(h, new LinearLayout.LayoutParams(0, dp(40), 1)); TextView a = label(action + "  →", 12, GOLD); row.addView(a); a.setOnClickListener(v -> click.run()); return row; }
    private TextView sectionTitle(String a, String b) { TextView v = title(a + "\n", 20); v.append(labelSpan(b)); return v; }
    private android.text.SpannableString labelSpan(String t) { android.text.SpannableString s = new android.text.SpannableString(t); s.setSpan(new android.text.style.ForegroundColorSpan(MUTED), 0, t.length(), 0); s.setSpan(new android.text.style.RelativeSizeSpan(.62f), 0, t.length(), 0); return s; }
    private View space(int h) { Space s = new Space(this); s.setLayoutParams(new LinearLayout.LayoutParams(1, dp(h))); return s; }
    private TextView review(String name, String text) { TextView v = label("★★★★★\n\n\"" + text + "\"\n\n— " + name, 13, WHITE); v.setPadding(dp(16), dp(16), dp(16), dp(16)); v.setBackground(round(SURFACE, 18)); return v; }
    private void faq(LinearLayout p, String q, String a) { TextView v = label(q + "\n\n" + a, 14, WHITE); v.setPadding(dp(16), dp(16), dp(16), dp(16)); v.setBackground(round(SURFACE, 18)); p.addView(v); p.addView(space(9)); }
    private int dp(int x) { return (int)(x * getResources().getDisplayMetrics().density + 0.5f); }
    private String displayName() { String n = api.getDisplayName(); if (n == null || n.trim().isEmpty()) { String e = api.getEmail(); if (e != null && e.contains("@")) n = e.substring(0, e.indexOf('@')); else n = "User"; } return n; }
    private String initials(String n) { if (n == null || n.trim().isEmpty()) return "U"; String[] p = n.trim().split("\\s+"); return p.length == 1 ? p[0].substring(0, 1).toUpperCase() : (p[0].substring(0, 1) + p[p.length - 1].substring(0, 1)).toUpperCase(); }
    private void run(Runnable r) { executor.execute(r); }
    private void runUi(Runnable r) { runOnUiThread(r); }
    private void showMessage(String t, String m) { new AlertDialog.Builder(this).setTitle(t).setMessage(m == null ? "" : m).setPositiveButton("OK", null).show(); }

    static class Course { String id, name, description, badge; int price, accent, image; Course(String id, String n, String d, int p, String b, int a, int im) { this.id=id; name=n; description=d; price=p; badge=b; accent=a; image=im; } }
    static class Membership { String plan, description, badge; int price, accent, image; Membership(String p, String d, int pr, String b, int a, int im) { plan=p; description=d; price=pr; badge=b; accent=a; image=im; } }
}



