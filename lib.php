<?php

// This file is part of Moodle - http://moodle.org/
//
// Moodle is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// Moodle is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with Moodle.  If not, see <http://www.gnu.org/licenses/>.
/**
 * TinyMCE Cincopa plugin version details.
 *
 * @package   tinymce_cincopa
 * @copyright Cincopa LTD <moodle@cincopa.com>
 * @license   http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
defined('MOODLE_INTERNAL') || die();

class tinymce_cincopa extends editor_tinymce_plugin {

    protected $buttons = array('cincopa');

    protected function update_init_params(array &$params, context $context, array $options = null) {
        global $PAGE, $CFG;

        $PAGE->requires->js(new moodle_url('/lib/editor/tinymce/plugins/cincopa/tinymce/js/jquery.min.js'));


        $this->add_js_plugin($params);
    }

    /**
     * Get sort order.
     *
     * @return 110
     */
    protected function get_sort_order() {
        return 110;
    }

}
