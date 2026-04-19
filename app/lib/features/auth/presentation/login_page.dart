import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:portfolio_pbn/shared/widgets/widgets.dart';

import '../../../core/auth/auth_provider.dart';
import '../../../core/auth/auth_state.dart';
import '../../../core/notifications/push_provider.dart';
import '../../../core/theme/app_breakpoints.dart';
import '../../../core/theme/app_spacing.dart';
import '../../../core/utils/app_logger.dart';
import 'widgets/login_brand.dart';
import 'widgets/login_card.dart';
import 'widgets/login_two_column_layout.dart';

part 'login_page_builders.dart';

// ── LoginPage ─────────────────────────────────────────────────────────────────

/// Pantalla de inicio de sesión del panel de administración.
///
/// Formulario con email + password, validación local con [AppValidators],
/// y login mediante [AuthNotifier]. El router redirige automáticamente al
/// dashboard cuando el estado cambia a [Authenticated].
class LoginPage extends ConsumerStatefulWidget {
  const LoginPage({super.key});

  @override
  ConsumerState<LoginPage> createState() => _LoginPageState();
}

class _LoginPageState extends ConsumerState<LoginPage> {
  final _formKey = GlobalKey<FormState>();
  final _emailController = TextEditingController();
  final _passwordController = TextEditingController();
  bool _obscurePassword = true;

  @override
  void dispose() {
    _emailController.dispose();
    _passwordController.dispose();
    super.dispose();
  }

  // ── Handlers ────────────────────────────────────────────────────────────────

  @override
  Widget build(BuildContext context) => _buildPage(context);
}
